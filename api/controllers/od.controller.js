import OdRequest from "../models/od.model.js";
import { errorHandler } from "../utils/error.js";
import { notifyOdRequestStatus } from "./email.service.js";

export const createOdRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      studentId,
      userType,
      rollNo,
      regNo,
      batchId,
      sectionId,
      section_name,
      departmentId,
      classInchargeId,
      mentorId,
      odType,
      startDate,
      endDate,
      noOfDays,
      // Internal OD fields
      reason,
      // External OD fields
      collegeName,
      city,
      eventName,
      paperTitle,
      projectTitle,
      eventDetails,
      selectedEventType,
    } = req.body;

    // Convert selectedEventType object to array of selected event types
    const eventTypes = Object.entries(selectedEventType || {})
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Check for existing OD request in the same period
    const existingOd = await OdRequest.findOne({
      studentId,
      $or: [
        {
          fromDate: { $lte: endDate },
          toDate: { $gte: startDate },
        },
        {
          fromDate: { $gte: startDate },
          toDate: { $lte: endDate },
        },
      ],
    });

    if (existingOd) {
      return res.status(400).json({
        success: false,
        message: "You already have an OD request for this period",
      });
    }

    const studentOdRequest = new OdRequest({
      name,
      email,
      studentId,
      userType,
      rollNo,
      regNo,
      batchId,
      sectionId,
      section_name,
      departmentId,
      classInchargeId,
      mentorId,
      fromDate: startDate,
      toDate: endDate,
      noOfDays,
      odType,
      // Internal OD data
      reason: odType === "Internal" ? reason : null,
      // External OD data
      collegeName: odType === "External" ? collegeName : null,
      city: odType === "External" ? city : null,
      eventName: odType === "External" ? eventName : null,
      eventTypes: odType === "External" ? eventTypes : [],
      paperTitle: odType === "External" ? paperTitle : null,
      projectTitle: odType === "External" ? projectTitle : null,
      eventDetails: odType === "External" ? eventDetails : null,
      isStaff: false,
    });

    await studentOdRequest.save();
    res.status(201).json({
      success: true,
      message: "Student OD request submitted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting the OD request",
    });
  }
};

export const deleteodbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOd = await OdRequest.findByIdAndDelete(id);
    if (!deletedOd) {
      return res.status(404).json({ message: "Od request not found" });
    }
    res.status(200).json({ message: "Od request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getodrequestbyUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await OdRequest.find({ studentId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getodrequestbyMentorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await OdRequest.find({ mentorId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching od requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getodrequestbyclassinchargeid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await OdRequest.find({ classInchargeId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching od requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateOdRequestStatusByMentorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, mentorcomment } = req.body;
    const validStatuses = ["approved", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }

    const odRequest = await OdRequest.findByIdAndUpdate(
      id,
      {
        "approvals.mentor.status": status,
        $set: {
          mentorcomment:
            mentorcomment !== "" ? mentorcomment : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "Od request not found",
      });
    }
    const who = "Mentor";
    await odRequest.computeStatus();
    await odRequest.save();

    await notifyOdRequestStatus(
      odRequest.email,
      odRequest.name,
      status,
      odRequest.fromDate,
      odRequest.toDate,
      mentorcomment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Od request ${status} successfully`,
      odRequest,
    });
  } catch (error) {
    console.error("Error updating od request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateOdRequestStatusByClassInchargeId = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const { status, classInchargeComment } = req.body;
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }

    const odRequest = await OdRequest.findByIdAndUpdate(
      id,
      {
        "approvals.classIncharge.status": status,
        $set: {
          classInchargeComment:
            classInchargeComment !== ""
              ? classInchargeComment
              : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (odRequest.mentorId === null) {
      odRequest.approvals.mentor.status = status;
    }

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "Od request not found",
      });
    }

    const who = "Class Incharge";
    await odRequest.computeStatus();
    await odRequest.save();
    await notifyOdRequestStatus(
      odRequest.email,
      odRequest.name,
      status,
      odRequest.fromDate,
      odRequest.toDate,
      classInchargeComment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Od request ${status} successfully`,
      odRequest,
    });
  } catch (error) {
    console.error("Error updating od request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const updateOdRequestStatusByHODId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, hodComment } = req.body;
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Status must be 'approved' or 'rejected'.",
      });
    }
    const odRequest = await OdRequest.findByIdAndUpdate(
      id,
      {
        "approvals.hod.status": status,
        $set: {
          hodComment: hodComment
            ? hodComment
            : ""
            ? classInchargeComment
            : "No Comments Yet",
        },
      },
      { new: true }
    );

    if (!odRequest) {
      return res.status(404).json({
        success: false,
        message: "Od request not found",
      });
    }

    const who = "HOD";
    await odRequest.computeStatus();
    await odRequest.save();
    await notifyOdRequestStatus(
      odRequest.email,
      odRequest.name,
      status,
      odRequest.fromDate,
      odRequest.toDate,
      hodComment,
      who
    );

    res.status(200).json({
      success: true,
      message: `Od request ${status} successfully`,
      odRequest,
    });
  } catch (error) {
    console.error("Error updating od request status:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

export const getodrequestsbySectionId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await OdRequest.find({ sectionId: id }).sort({
      createdAt: -1,
    });
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching od requests:", error);
    const customError = errorHandler(500, "Internal Server Error");
    next(customError);
  }
};

// BUG: Not Working but in use in the hoddash to be fixed

export const mentors = async (req, res) => {
  const { ids } = req.query; // Correctly extract the ids query parameter
  const sectionIDs = ids.split(","); // Assuming ids are sent as a comma-separated string

  try {
    const response = await Staff.find({
      staff_handle_section: { $in: sectionIDs },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in Fetching the Data ", error.message);
    res.status(500).json({ error: "Failed to fetch mentors" });
  }
};

export const getWardDetailsByRollNumber = async (req, res, next) => {
  const { rollNo } = req.params;
  const currentDate = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(currentDate.getMonth() - 1);
  try {
    const response = await OdRequest.find({
      rollNo: rollNo,
      fromDate: { $gte: oneMonthAgo },
    });
    res.status(200).json(response);
  } catch (error) {
    next("Error in Fetching the Ward Details", error.message);
  }
};
