import React, { useState, useEffect } from 'react';
import { getAllLeaveRequests, updateLeaveStatus } from '../backend';

const LeavesAdmin = () => {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState('Pending');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getAllLeaveRequests();
        setRequests(data);
        setLoading(false);
    };

    const handleStatusUpdate = async (id, status) => {
        if (!window.confirm(`Are you sure you want to ${status} this request?`)) return;

        const comment = prompt("Add an optional comment (or leave blank):");
        const res = await updateLeaveStatus(id, status, comment);

        if (res.success) {
            loadRequests();
        } else {
            alert("Failed to update status.");
        }
    };

    const filteredRequests = requests.filter(req => {
        if (filter === 'All') return true;
        return req.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Approved': return 'bg-success';
            case 'Rejected': return 'bg-danger';
            default: return 'bg-warning text-dark';
        }
    };

    return (
        <div className="container mt-4">
            <h2>Leave Management</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="btn-group">
                    <button className={`btn ${filter === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('Pending')}>Pending</button>
                    <button className={`btn ${filter === 'Approved' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('Approved')}>Approved</button>
                    <button className={`btn ${filter === 'Rejected' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('Rejected')}>Rejected</button>
                    <button className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('All')}>All</button>
                </div>
                <button className="btn btn-outline-secondary" onClick={loadRequests}>Refresh</button>
            </div>

            {loading ? <p>Loading requests...</p> : (
                <div className="table-responsive">
                    <table className="table table-bordered hover">
                        <thead className="table-light">
                            <tr>
                                <th>Employee</th>
                                <th>Type</th>
                                <th>Dates</th>
                                <th>Reason</th>
                                <th>Applied At</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => (
                                <tr key={req.id}>
                                    <td>
                                        <strong>{req.empName}</strong><br />
                                        <small className="text-muted">{req.email}</small>
                                    </td>
                                    <td>{req.leaveType}</td>
                                    <td>
                                        {new Date(req.startDate.seconds * 1000).toLocaleDateString()} to <br />
                                        {new Date(req.endDate.seconds * 1000).toLocaleDateString()}
                                    </td>
                                    <td>{req.reason}</td>
                                    <td>{new Date(req.appliedAt.seconds * 1000).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(req.status)}`}>{req.status}</span>
                                        {req.adminComment && <div className="small text-muted mt-1">Note: {req.adminComment}</div>}
                                    </td>
                                    <td>
                                        {req.status === 'Pending' && (
                                            <div className="btn-group btn-group-sm">
                                                <button className="btn btn-success" onClick={() => handleStatusUpdate(req.id, 'Approved')}>Approve</button>
                                                <button className="btn btn-danger" onClick={() => handleStatusUpdate(req.id, 'Rejected')}>Reject</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center">No {filter !== 'All' ? filter.toLowerCase() : ''} requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeavesAdmin;
