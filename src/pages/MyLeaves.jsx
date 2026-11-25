import { useState, useEffect } from 'react';
import { getMyLeaveRequests } from '../backend';
import { auth } from '../firebase';

const formatFirestoreDate = (val) => {
    if (!val) return '—';
    const d = val.seconds ? new Date(val.seconds * 1000) : new Date(val);
    return d.toLocaleDateString();
};

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaves = async () => {
            if (auth.currentUser) {
                const data = await getMyLeaveRequests(auth.currentUser.email);
                setLeaves(data);
            }
            setLoading(false);
        };
        fetchLeaves();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'text-success';
            case 'Rejected': return 'text-danger';
            default: return 'text-warning';
        }
    };

    if (loading) return <div className="container mt-5 text-center"><div className="spinner-border text-primary"></div></div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">My Leave History</h2>

            {leaves.length === 0 ? (
                <div className="alert alert-info">You haven&apos;t applied for any leaves yet.</div>
            ) : (
                <div className="row">
                    {leaves.map(leave => (
                        <div key={leave.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="card-title mb-0">{leave.leaveType}</h5>
                                        <span className={`badge bg-light ${getStatusColor(leave.status)} border`}>{leave.status}</span>
                                    </div>
                                    <p className="card-text text-muted small mb-3">
                                        Applied on: {formatFirestoreDate(leave.appliedAt)}
                                    </p>

                                    <div className="mb-2">
                                        <strong>Duration:</strong><br />
                                        {formatFirestoreDate(leave.startDate)} - {formatFirestoreDate(leave.endDate)}
                                    </div>

                                    <div className="mb-2">
                                        <strong>Reason:</strong><br />
                                        <span className="text-secondary">{leave.reason}</span>
                                    </div>

                                    {leave.adminComment && (
                                        <div className="alert alert-secondary py-2 mt-3 mb-0 small">
                                            <strong>Admin Note:</strong> {leave.adminComment}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLeaves;
