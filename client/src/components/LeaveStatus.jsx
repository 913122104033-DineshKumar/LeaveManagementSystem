import React, { useState } from 'react';
import './LeaveStatus.scss';
import StatusDot from './StatusDot';
import { Select } from 'flowbite-react';

const LeaveStatus = ({ leaveRequests, updateStatus }) => {
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('pending');

  if (!Array.isArray(leaveRequests)) {
    console.log('Leave requests not an array:', leaveRequests);
    return <div>No leave requests found.</div>;
  }

  const filteredRequests = leaveRequests.filter(request => {
    const toDate = new Date(request.toDate);
    const today = new Date();

    switch (filter) {
      case 'past7days':
        return toDate >= new Date(today.setDate(today.getDate() - 7));
      case 'past1month':
        return toDate >= new Date(today.setMonth(today.getMonth() - 1));
      default:
        return true;
    }
  });

  const pendingRequests = filteredRequests.filter(
    request =>
      request.approvals.mentor.status === 'pending' ||
      request.approvals.classIncharge.status === 'pending' ||
      request.approvals.hod.status === 'pending'
  );

  const approvedRequests = filteredRequests.filter(
    request =>
      (request.approvals.mentor.status === 'approved' &&
        request.approvals.classIncharge.status === 'approved' &&
        request.approvals.hod.status === 'approved') ||
      (request.approvals.mentor.status === 'rejected' &&
        request.approvals.classIncharge.status === 'rejected' &&
        request.approvals.hod.status === 'rejected')
  );

  return (
    <div className="leave-status p-5">
      <div className="button-group">
        <button className={view === 'pending' ? 'active' : ''} onClick={() => setView('pending')}>
          Pending Requests
        </button>
        <button className={view === 'approved' ? 'active' : ''} onClick={() => setView('approved')}>
          Approved Requests
        </button>
      </div>

      <div className={`container ${view === 'pending' ? 'active' : ''}`}>
        <div className="filter-dropdown flex gap-3 items-center">
          <label>Filter by:</label>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="past7days">Past 7 Days</option>
            <option value="past1month">Past 1 Month</option>
          </Select>
        </div>
        <br /><br />

        {pendingRequests.length > 0 ? (
          pendingRequests.map(request => (
            <div key={request._id} className="leave-status-item">
              <div className='grid grid-cols-2'>
                <p className="p-3 border">Leave From: <br /> <span>{new Date(request.fromDate).toLocaleDateString()}</span></p>
                <p className="p-3 border">Leave To: <br /> <span>{new Date(request.toDate).toLocaleDateString()}</span></p>
              </div>
              <div className="grid grid-cols-2">
                <p className='p-3 border'>Apply Date: <br /> <span>{new Date(request.createdAt).toLocaleDateString()}</span></p>
                <p className="p-3 border">No. of Days: <br/> <span>{request.noOfDays}</span></p>
              </div>

              <div className="status-dots">
                <StatusDot status={request.approvals.mentor.status} role="mentor" updateStatus={updateStatus} showLine={true} />
                <StatusDot status={request.approvals.classIncharge.status} role="classIncharge" updateStatus={updateStatus} showLine={true} />
                <StatusDot status={request.approvals.hod.status} role="hod" updateStatus={updateStatus} showLine={false} />
              </div>
              <div className="pending-status">
                Pending
              </div>
            </div>
          ))
        ) : (
          <div>No pending requests found.</div>
        )}
      </div>

      <div className={`container ${view === 'approved' ? 'active' : ''}`}>
        <div className="filter-dropdown flex gap-3 items-center">
          <label>Filter by:</label>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="past7days">Past 7 Days</option>
            <option value="past1month">Past 1 Month</option>
          </Select>
        </div>
        <br /><br />

        {approvedRequests.length > 0 ? (
          approvedRequests.map(request => (
            <div key={request._id} className="leave-status-item">
              <div className='grid grid-cols-2'>
                <p className="p-3 border">Leave From: <br /> <span>{new Date(request.fromDate).toLocaleDateString()}</span></p>
                <p className="p-3 border">Leave To: <br /> <span>{new Date(request.toDate).toLocaleDateString()}</span></p>
              </div>
              <div className="grid grid-cols-2">
                <p className='p-3 border'>Apply Date: <br /> <span>{new Date(request.createdAt).toLocaleDateString()}</span></p>
                <p className="p-3 border">No. of Days: <br/> <span>{request.noOfDays}</span></p>
              </div>
              <br />
              <div className='font-bold'>Status :</div>
              <div className="status-dots">
                <StatusDot status={request.approvals.mentor.status} role="mentor" showLine={true} />
                <StatusDot status={request.approvals.classIncharge.status} role="classIncharge" showLine={true} />
                <StatusDot status={request.approvals.hod.status} role="hod" showLine={false} />
              </div>
              {request.approvals.mentor.status === 'approved' && request.approvals.classIncharge.status === 'approved' && request.approvals.hod.status === 'approved' && (
                <div className="accepted-status">Accepted</div>
              )}
              {request.approvals.mentor.status === 'pending' && request.approvals.classIncharge.status === 'pending' && request.approvals.hod.status === 'pending' && (
                <div className="pending-status">Pending</div>
              )}
              {request.approvals.mentor.status === 'rejected' && request.approvals.classIncharge.status === 'rejected' && request.approvals.hod.status === 'rejected' && (
                <div className="rejected-status">Rejected</div>
              )}
            </div>
          ))
        ) : (
          <div>No approved requests found.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveStatus;
