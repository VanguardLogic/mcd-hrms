import { useState, useEffect } from 'react';
import { addLeaveType, getLeaveTypes, deleteLeaveType } from '../backend';

const LeaveTypes = () => {
    const [types, setTypes] = useState([]);
    const [newType, setNewType] = useState({ name: '', description: '', isActive: true });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        const data = await getLeaveTypes();
        setTypes(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await addLeaveType(newType);
        if (res.success) {
            setMessage('Leave type added successfully!');
            setNewType({ name: '', description: '', isActive: true });
            loadTypes();
        } else {
            setMessage('Error adding leave type: ' + res.error.message);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave type?')) {
            await deleteLeaveType(id);
            loadTypes();
        }
    };

    return (
        <div className="container mt-4">
            <h2>Leave Configuration</h2>

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">Add New Leave Category</div>
                <div className="card-body">
                    {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Category Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newType.name}
                                onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                                required
                                placeholder="e.g. Medical Leave, Maternal Leave"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newType.description}
                                onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                                placeholder="Brief description of the leave policy"
                            />
                        </div>
                        <div className="mb-3 form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={newType.isActive}
                                onChange={(e) => setNewType({ ...newType, isActive: e.target.checked })}
                                id="isActiveCheck"
                            />
                            <label className="form-check-label" htmlFor="isActiveCheck">Active</label>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">Existing Categories</div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {types.map(type => (
                                    <tr key={type.id}>
                                        <td>{type.name}</td>
                                        <td>{type.description}</td>
                                        <td>
                                            <span className={`badge ${type.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                {type.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(type.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {types.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center">No leave categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveTypes;
