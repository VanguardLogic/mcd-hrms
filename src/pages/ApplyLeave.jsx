import { useState, useEffect } from 'react';
import { getLeaveTypes, applyForLeave, getMyProfile } from '../backend';
import { auth } from '../firebase';

const ApplyLeave = ({ setTab }) => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [formData, setFormData] = useState({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (auth.currentUser) {
                const profile = await getMyProfile(auth.currentUser.email);
                setUserProfile(profile);
            }
            const types = await getLeaveTypes();
            setLeaveTypes(types.filter(t => t.isActive));
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!auth.currentUser || !userProfile) {
            alert("You must be logged in to apply for leave.");
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("End date must be after start date.");
            return;
        }

        setLoading(true);
        const leaveData = {
            ...formData,
            email: auth.currentUser.email,
            empId: userProfile.empId || 'UNKNOWN',
            empName: userProfile.name || auth.currentUser.displayName || 'Unknown',
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate)
        };

        const res = await applyForLeave(leaveData);
        if (res.success) {
            alert("Leave application submitted successfully!");
            if (setTab) setTab('my_leaves');
        } else {
            alert("Error submitting leave request: " + res.error.message);
        }
        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Apply for Leave</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Leave Type</label>
                                    <select
                                        className="form-control"
                                        required
                                        value={formData.leaveType}
                                        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                                    >
                                        <option value="">Select Leave Type</option>
                                        {leaveTypes.map(type => (
                                            <option key={type.id} value={type.name}>{type.name}</option>
                                        ))}
                                    </select>
                                    {formData.leaveType && leaveTypes.find(t => t.name === formData.leaveType)?.description && (
                                        <div className="form-text">{leaveTypes.find(t => t.name === formData.leaveType).description}</div>
                                    )}
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Reason</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        required
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        placeholder="Please provide a reason for your leave request..."
                                    ></textarea>
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;
