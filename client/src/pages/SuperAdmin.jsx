import React, { useState, useEffect } from "react";
import { useFetchDepartments } from "../../hooks/useFetchData";
import UploadExcel from "../components/systems/excelUpload";
import {
  Building2,
  Upload,
  School,
  Users,
  Trash2,
  PlusCircle,
  ChevronRight,
  Settings,
  BookOpen,
  UserPlus,
  GraduationCap,
} from "lucide-react";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const SuperAdmin = () => {
  const departments = useFetchDepartments();
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [classDetails, setClassDetails] = useState({
    mentors: [],
    classIncharges: [],
  });
  const [newMentorName, setNewMentorName] = useState("");
  const [newSection, setNewSection] = useState("");
  const [newDepartment, setNewDepartment] = useState("");
  const [sectionAlertMessage, setSectionAlertMessage] = useState("");
  const [departmentAlertMessage, setDepartmentAlertMessage] = useState("");
  const [MentorAlertMessage, setMentorAlertMessage] = useState("");
  const [classInchargeMessage, setClassInchargeMessage] = useState("");
  const [newBatchName, setNewBatchName] = useState("");
  const [batchAlertMessage, setBatchAlertMessage] = useState("");
  const [uploadType, setUploadType] = useState("student");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (selectedDepartment) {
      fetchBatches(selectedDepartment._id);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedBatch) {
      fetchSections(selectedBatch._id);
    }
  }, [selectedBatch]);

  useEffect(() => {
    if (selectedSection) {
      fetchClassDetails(selectedSection._id);
    }
  }, [selectedSection]);

  useEffect(() => {
    if (sectionAlertMessage) {
      const timer = setTimeout(() => {
        setSectionAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sectionAlertMessage]);

  useEffect(() => {
    if (departmentAlertMessage) {
      const timer = setTimeout(() => {
        setDepartmentAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [departmentAlertMessage]);

  useEffect(() => {
    if (MentorAlertMessage) {
      const timer = setTimeout(() => {
        setMentorAlertMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [MentorAlertMessage]);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    setSelectedBatch(null);
    setSelectedSection(null); // Reset section selection
  };

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch === selectedBatch ? null : batch);
    setSelectedSection(null); // Reset section selection
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section === selectedSection ? null : section);
  };

  const handleAddSection = async () => {
    try {
      const response = await fetch(`/api/addSection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchId: selectedBatch._id,
          section_name: newSection,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add Section");
      }
      setSectionAlertMessage("added successfully");
      setNewSection("");
    } catch (error) {
      console.error("Error adding section:", error.message);
      setSectionAlertMessage("failed to Add!");
    }
  };

  const handleAddDepartment = async () => {
    try {
      const response = await fetch(`/api/departments/addDepartment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dept_name: newDepartment }),
      });
      setDepartmentAlertMessage(`Added Successfullly`);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error.message);
      setDepartmentAlertMessage("failed to Add!");
    }
  };

  const handleAddBatch = async () => {
    try {
      const response = await fetch(`/api/batches/addBatch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dept_id: selectedDepartment._id,
          batch_name: newBatchName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add Batch");
      }
      setBatchAlertMessage("Batch added successfully");
      setNewBatchName("");
    } catch (error) {
      console.error("Error adding batch:", error.message);
      setBatchAlertMessage("Failed to add Batch!");
    }
  };

  const handleDeleteClass = async (sectionId) => {
    try {
      const response = await fetch(`/api/sections/deleteSection/${sectionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteBatch = async (batchId) => {
    try {
      const response = await fetch(`/api/batches/deleteBatch/${batchId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    alert("Sure to delete");
    try {
      const response = await fetch(
        `/api/departments/deleteDepartment/${departmentId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete class");
      }
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const fetchBatches = async (departmentId) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/departments/${departmentId}/batches`);
      if (!response.ok) {
        throw new Error("Failed to fetch batches");
      }
      const data = await response.json();
      setBatches(data.sort((b, a) => a.batch_name.localeCompare(b.batch_name)));
    } catch (error) {
      console.error("Error fetching batches:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchSections = async (batchId) => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/batches/${batchId}/sections`);
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await response.json();
      setSections(
        data.sort((a, b) => a.section_name.localeCompare(b.section_name))
      );
    } catch (error) {
      console.error("Error fetching sections:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchClassDetails = async (sectionId) => {
    try {
      setIsFetching(true);

      const mentorResponse = await fetch(`/api/sections/${sectionId}/mentors`);
      if (!mentorResponse.ok) {
        throw new Error("Failed to fetch mentors");
      }
      const mentors = await mentorResponse.json();

      const classInchargeResponse = await fetch(
        `/api/sections/${sectionId}/classIncharges`
      );
      if (!classInchargeResponse.ok) {
        throw new Error("Failed to fetch class in-charges");
      }
      const classIncharges = await classInchargeResponse.json();

      setClassDetails({ mentors, classIncharges });
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching class details:", error.message);
      setIsFetching(false);
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    try {
      const response = await fetch(`/api/deletementors/${mentorId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete mentor");
      }
      setMentorAlertMessage("Mentor deleted successfully");
      fetchClassDetails(selectedSection._id);
    } catch (error) {
      console.error("Error deleting mentor:", error.message);
      setMentorAlertMessage("Failed to delete mentor");
    }
  };

  const handleDeleteClassIncharge = async (inchargeId) => {
    try {
      const response = await fetch(`/api/deleteClassIncharge/${inchargeId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete Class Incharge");
      }
      setClassInchargeMessage("ClassIncharge deleted successfully");
      fetchClassDetails(selectedSection._id);
    } catch (error) {
      console.error("Error deleting ClassIncharge:", error.message);
    }
  };

  const menuItems = [
    {
      id: "overview",
      icon: <Settings size={18} />,
      label: "Overview",
    },
    {
      id: "departments",
      icon: <Building2 size={18} />,
      label: "Departments",
    },
    {
      id: "upload",
      icon: <Upload size={18} />,
      label: "Data Upload",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <DashboardSidebar
        menuItems={menuItems}
        currentTab={uploadType}
        onTabChange={setUploadType}
        title="Super Admin Dashboard"
        onSidebarToggle={setIsSidebarOpen}
      />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        } p-6`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, Super Admin
          </h1>
          <p className="text-gray-600">
            Manage your institution's departments and data
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">Data Upload</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setUploadType("student")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                uploadType === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Student Upload
            </button>
            <button
              onClick={() => setUploadType("staff")}
              className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                uploadType === "staff"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              Staff Upload
            </button>
          </div>
          <UploadExcel type={uploadType} />
        </div>

        <div
          className={`grid grid-cols-1 ${
            isSidebarOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
          } gap-6`}
        >
          <div
            className={`${isSidebarOpen ? "lg:col-span-1" : "lg:col-span-1"}`}
          >
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="flex flex-col gap-4">
                {/* Add Department Form */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Departments
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="New Department"
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={handleAddDepartment}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <PlusCircle size={18} />
                      Add
                    </button>
                  </div>
                  {departmentAlertMessage && (
                    <p
                      className={`text-sm ${
                        departmentAlertMessage.includes("failed")
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {departmentAlertMessage}
                    </p>
                  )}
                </div>

                {/* Departments List */}
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
                  {departments.map((dept) => (
                    <div
                      key={dept._id}
                      onClick={() => handleDepartmentSelect(dept)}
                      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedDepartment === dept
                          ? "bg-blue-50 border-l-4 border-blue-500 shadow-md"
                          : "bg-gray-50 hover:bg-gray-100 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{dept.dept_acronym}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChevronRight
                          size={18}
                          className={`text-gray-400 transition-transform ${
                            selectedDepartment === dept ? "rotate-90" : ""
                          }`}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${dept.dept_name}?`
                              )
                            ) {
                              handleDeleteDepartment(dept._id);
                            }
                          }}
                          className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500">Total Departments</p>
                        <h3 className="text-2xl font-bold">
                          {departments.length}
                        </h3>
                      </div>
                      <Building2 className="text-blue-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500">Total Batches</p>
                        <h3 className="text-2xl font-bold">{batches.length}</h3>
                      </div>
                      <School className="text-green-500" size={32} />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500">Total Sections</p>
                        <h3 className="text-2xl font-bold">
                          {sections.length}
                        </h3>
                      </div>
                      <Users className="text-purple-500" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${isSidebarOpen ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            {selectedDepartment && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedDepartment.dept_name} Management
                  </h2>
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-700">
                        Batches
                      </h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newBatchName}
                          onChange={(e) => setNewBatchName(e.target.value)}
                          placeholder="New Batch"
                          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddBatch}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {batches.map((batch) => (
                        <div
                          key={batch._id}
                          onClick={() => handleBatchSelect(batch)}
                          className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                            selectedBatch === batch
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium">
                            {batch.batch_name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBatch(batch._id);
                            }}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedBatch && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700">
                          Sections
                        </h3>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            placeholder="New Section"
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleAddSection}
                            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-4 max-h-[300px] overflow-y-auto">
                        {sections.map((section) => (
                          <div
                            key={section._id}
                            className={`bg-gray-50 rounded-lg p-4 ${
                              selectedSection === section
                                ? "border-l-4 border-purple-500"
                                : ""
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">
                                Section {section.section_name}
                              </h3>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSectionSelect(section)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleDeleteClass(section._id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedSection && (
              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <div
                  className={`grid grid-cols-1 ${
                    isSidebarOpen ? "lg:grid-cols-1" : "lg:grid-cols-2"
                  } gap-6`}
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Mentors</h3>
                    <div className="space-y-2">
                      {classDetails.mentors.map((mentor) => (
                        <div
                          key={mentor._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{mentor.staff_name}</span>
                          <button
                            onClick={() => handleDeleteMentor(mentor._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Class Incharges
                    </h3>
                    <div className="space-y-2">
                      {classDetails.classIncharges.map((incharge) => (
                        <div
                          key={incharge._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{incharge.staff_name}</span>
                          <button
                            onClick={() =>
                              handleDeleteClassIncharge(incharge._id)
                            }
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
