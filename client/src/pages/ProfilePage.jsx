import React, { useState, useEffect } from "react";
import EditProfile from "../components/EditProfile";
import LeaveRequestForm from "../components/LeaveRequestForm";
import DashBoard from "./DashBoard";

const ProfilePage = () => {
  const [tab, setTab] = useState("LeaveRequestForm");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const renderComponent = () => {
    switch (tab) {
      case "LeaveRequestForm":
        return <LeaveRequestForm setTab={setTab} />;
      case "EditProfile":
        return <EditProfile />;
      case "DashBoard":
        return <DashBoard setTab={setTab} />;
      default:
        return <LeaveRequestForm setTab={setTab} />;
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
      <div className="md:w-[20%]  px-1 bg-linkedin-blue text-white lg:sticky top-0 md:h-screen overflow-y-auto">
        <div className="p-4 flex items-center justify-between">
          <h2
            className={`text-3xl tracking-wider text-white`}
            >
            My Profile 
          </h2>
          {isMobileView &&
          <div className={`bg-white/80 p-2 rounded-full ${
            isMobileView ? "cursor-pointer"  : ""
          } ${isProfileMenuOpen ? "rotate-180 transition-all duration-500" : "rotate-0 transition-all duration-500"} `} 
          
            onClick={isMobileView ? toggleProfileMenu : null}
          >
            <svg stroke="currentColor" fill="black" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M413.1 222.5l22.2 22.2c9.4 9.4 9.4 24.6 0 33.9L241 473c-9.4 9.4-24.6 9.4-33.9 0L12.7 278.6c-9.4-9.4-9.4-24.6 0-33.9l22.2-22.2c9.5-9.5 25-9.3 34.3.4L184 343.4V56c0-13.3 10.7-24 24-24h32c13.3 0 24 10.7 24 24v287.4l114.8-120.5c9.3-9.8 24.8-10 34.3-.4z"></path></svg>
          </div>
        }
        </div>
        <ul
          className={`space-y-2 px-1  mb-4 transition-all duration-300 overflow-hidden ${
            isMobileView
              ? isProfileMenuOpen
                ? "max-h-96"
                : "max-h-0"
              : "max-h-full"
          }`}
        >
          <li
            onClick={() => setTab("LeaveRequestForm")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "LeaveRequestForm"
                ? "bg-white/60 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Request Leave
          </li>
          <li
            onClick={() => setTab("EditProfile")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "EditProfile"
                ? "bg-white/60 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            Edit Profile
          </li>
          <li
            onClick={() => setTab("DashBoard")}
            className={`cursor-pointer py-2 px-4 transition-all duration-300 rounded-md ${
              tab === "DashBoard"
                ? "bg-white/60 text-black font-bold"
                : "hover:bg-white/20 text-white font-bold"
            }`}
          >
            My Requests
          </li>
        </ul>
      </div>
      <div className="flex-1  overflow-y-auto">{renderComponent()}</div>
    </div>
  );
};

export default ProfilePage;
