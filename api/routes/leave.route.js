import express from "express";
import {
  createLeaveRequest,
  getleaverequestbyUserId,
  getleaverequestbyMentorId,
  getleaverequestbyclassinchargeid,
  updateLeaveRequestStatusByMentorId,
  updateLeaveRequestStatusByClassInchargeId,
  mentors,
  getleaverequestsbySectionId,
  updateLeaveRequestStatusByHODId,
  getWardDetailsByRollNumber,
  deleteleavebyId,
} from "../controllers/leave.controller.js";

const router = express.Router();

router.post("/leave-request", createLeaveRequest);
router.get("/getleaverequest/:id", getleaverequestbyUserId);
router.delete("/deleteleave/:id", deleteleavebyId);
router.get("/getleaverequestbymentorid/:id", getleaverequestbyMentorId);
router.get(
  "/getleaverequestbyclassinchargeid/:id",
  getleaverequestbyclassinchargeid
);

router.get("/mentors", mentors);
// router.get('/getStaffLeaveRequests', getStaffLeaveRequests);
router.get("/leaverequestsbysectionid/:id", getleaverequestsbySectionId);

router.post(
  "/leave-requestsbymentorid/:id/status",
  updateLeaveRequestStatusByMentorId
);
router.post(
  "/leave-requestsbyclassinchargeid/:id/status",
  updateLeaveRequestStatusByClassInchargeId
);
router.post(
  "/leave-requestsbyhodid/:id/status",
  updateLeaveRequestStatusByHODId
);

router.get("/getWardDetailsByRollNumber/:rollNo", getWardDetailsByRollNumber);

export default router;
