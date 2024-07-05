import { useState,useEffect } from "react";

export const useFetchDepartments = () => {
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await fetch(`/api/departments/getdepartments`);
                const data = await res.json();
                if (res.ok) {
                    setDepartments(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchDepartments();
    }, []);
    return departments;
};

export const useFetchLeaveRequests = ({id}) => {
    const [leavefromapi, setLeavefromapi] = useState([]);
    useEffect(() => {
        const fetchLeaveRequest = async () => {
            try {
                const res = await fetch(`/api/getleaverequest/${id}`);
                const data = await res.json();
                if (res.ok) {
                  setLeavefromapi(data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchLeaveRequest();
    }, []);
    return leavefromapi;
};


export const useFetchLeaveRequestForMentor=(id)=>{
    const[leaveRequestsAsMentor,setLeaveRequestsAsMentor] = useState([]);
    useEffect(()=>{
        const fetchLeaveRequestsForMentor = async () => {
          try {
            const res = await fetch(`/api/getleaverequestbymentorid/${id}`);
            const data = await res.json();
            if (res.ok) {
              // Modify data to include section names
              const requestsWithSectionNames = await Promise.all(
                data.map(async (req) => {
                  const sectionRes = await fetch(`/api/section/${req.sectionId}`);
                  const sectionData = await sectionRes.json();
                  if (sectionRes.ok) {
                    return { ...req, sectionName: sectionData.name };
                  } else {
                    console.error(`Failed to fetch section name for ID ${req.sectionId}`);
                    return req; // Fallback to original request if section name fetch fails
                  }
                })
              );
              setLeaveRequestsAsMentor(requestsWithSectionNames);
            }
          } catch (error) {
            console.error('Error fetching leave requests:', error);
          }
        };
    
        fetchLeaveRequestsForMentor();
      }, [id]);
      return leaveRequestsAsMentor;
}

export const useFetchLeaveRequestForClassIncharge=(id)=>{
    const[leaveRequestsAsClassIncharge,setLeaveRequestsAsClassIncharge] = useState([]);
    useEffect(()=>{
        const fetchLeaveRequestsForClassIncharge = async () => {
          try {
            const res = await fetch(`/api/getleaverequestbyclassinchargeid/${id}`);
            const data = await res.json();
            if (res.ok) {
              // Modify data to include section names
              const requestsWithSectionNames = await Promise.all(
                data.map(async (req) => {
                  const sectionRes = await fetch(`/api/section/${req.sectionId}`);
                  const sectionData = await sectionRes.json();
                  if (sectionRes.ok) {
                    return { ...req, sectionName: sectionData.name };
                  } else {
                    console.error(`Failed to fetch section name for ID ${req.sectionId}`);
                    return req; // Fallback to original request if section name fetch fails
                  }
                })
              );
              setLeaveRequestsAsClassIncharge(requestsWithSectionNames);
            }
          } catch (error) {
            console.error('Error fetching leave requests:', error);
          }
        };
    
        fetchLeaveRequestsForClassIncharge();
      }, [id]);
      return leaveRequestsAsClassIncharge;
}