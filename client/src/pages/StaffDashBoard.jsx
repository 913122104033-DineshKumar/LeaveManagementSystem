import React, { useState, useEffect } from "react";
import LeaveRequestForm from "../components/LeaveRequestForm";
import LeaveReport from "../components/LeaveReport";
import MentorLeaveFromStudents from "../components/MentorLeaveFromStudents";
import ClassInchargeLeaveFromStudent from "../components/ClassInchargeLeaveFromStudent";
import DashBoard from "./DashBoard";
import { useSelector } from "react-redux";
import { useFetchLeaveRequestForClassIncharge, useFetchLeaveRequestForMentor } from "../../hooks/useFetchData";
import { FaArrowDown } from "react-icons/fa6";

const StaffDashBoard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("Leave Reports");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const mentorRequests = useFetchLeaveRequestForMentor(currentUser._id);
  const classInchargeRequest = useFetchLeaveRequestForClassIncharge(currentUser._id);

  const renderComponent = () => {
    switch (tab) {
      case "Leave Reports":
        return <LeaveReport />;
      case "Request Leave":
        return <LeaveRequestForm />;
      case "Your Leave Requests":
        return <DashBoard />;
      case "As Mentor":
        return <MentorLeaveFromStudents leaveRequestsAsMentor={mentorRequests} />
      case "As Class Incharge":
        return <ClassInchargeLeaveFromStudent leaveRequestsAsClassIncharge={classInchargeRequest} />
      default:
        return <LeaveReport />;
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-200">
      <div className="md:w-[20%] p-1 bg-linkedin-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-3xl tracking-wider text-white">Departments</h2>
          {isMobileView && (
            <div
              className={`bg-white/80 p-2 rounded-full ${
                isMobileView ? "cursor-pointer" : ""
              } ${isProfileMenuOpen ? "rotate-180 transition-all duration-500" : "rotate-0 transition-all duration-500"}`}
              onClick={isMobileView ? toggleProfileMenu : null}
            >
<FaArrowDown className="text-black"/>

            </div>
          )}
        </div>
        <ul
          className={`space-y-2 px-1  transition-all duration-300 overflow-hidden ${
            isMobileView ? (isProfileMenuOpen ? "max-h-96" : "max-h-0") : "max-h-full"
          }`}
        >
          <li
            onClick={() => setTab("Leave Reports")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Leave Reports" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Leave Reports
          </li>
          <li
            onClick={() => setTab("Request Leave")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Request Leave" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Request Leave
          </li>
          <li
            onClick={() => setTab("Your Leave Requests")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "Your Leave Requests" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Your Leave Requests
          </li>
          <li
            onClick={() => setTab("As Mentor")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "As Mentor" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            As Mentor
          </li>
          <li
            onClick={() => setTab("As Class Incharge")}
            className={`cursor-pointer py-2 pb-3 px-4 transition-all duration-300 rounded-md ${
              tab === "As Class Incharge" ? "bg-white/60 text-black font-bold" : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            As Class Incharge
          </li>
        </ul>
      </div>
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">{renderComponent()}</div>
    </div>
  );
};

export default StaffDashBoard;
