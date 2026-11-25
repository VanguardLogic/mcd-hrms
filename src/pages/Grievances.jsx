import { useState, useEffect } from "react";
import { getGrievances, submitGrievance, resolveGrievance, getPublicEmployees } from "../backend";

function Grievances({ role, user }) {
    const [complaints, setComplaints] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [filterCategory, setFilterCategory] = useState("All");

    useEffect(() => {
        loadComplaints();
        loadEmployees();
    }, []);

    async function loadEmployees() {
        try {
            const data = await getPublicEmployees();
            setEmployees(data);
        } catch (error) {
            console.error(error);
        }
    }

    async function loadComplaints() {
        const data = await getGrievances();
        setComplaints(data);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const title = e.target.title.value.trim();
        const description = e.target.description.value.trim();
        const category = e.target.category.value;
        const targetEmpId = e.target.targetEmpId ? e.target.targetEmpId.value : null;

        let targetEmployee = null;
        if (targetEmpId) {
            const emp = employees.find(e => e.id === targetEmpId);
            if (emp) targetEmployee = { id: emp.id, name: emp.name, dept: emp.dept };
        }

        try {
            await submitGrievance(title, description, category, user?.email, targetEmployee);
            alert("Complaint submitted successfully!");
            e.target.reset();
            setShowForm(false);
            loadComplaints();
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleResolve(id) {
        try {
            await resolveGrievance(id);
            loadComplaints();
        } catch (error) {
            alert("Error: " + error.message);
        }
    }

    function getStatusColor(status) {
        if (status === "resolved") return "bg-success";
        if (status === "pending") return "bg-warning text-dark";
        return "bg-secondary";
    }

    return (
        <div className="animate-slide-up">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center">
                    <div className="p-2 bg-white rounded-3 shadow-sm me-3 text-primary">
                        <span className="fs-4">📝</span>
                    </div>
                    <div>
                        <h4 className="fw-bold mb-0">Grievance Redressal</h4>
                        <p className="text-muted small mb-0">Track and resolve employee requests transparently.</p>
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <select
                        className="form-select rounded-pill shadow-sm border-0"
                        style={{ width: "200px" }}
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {/* Dynamic categories or fixed list */}
                        <option value="workplace">Workplace Issue</option>
                        <option value="salary">Salary Problem</option>
                        <option value="leave">Leave Related</option>
                        <option value="harassment">Harassment</option>
                        <option value="inter-dept">Inter-department</option>
                        <option value="Public Complaint">Public Complaint</option>
                        <option value="Corruption">Corruption</option>
                        <option value="Misbehavior">Misbehavior</option>
                        <option value="Delay">Delay</option>
                        <option value="Other">Other</option>
                    </select>
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium align-self-center" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Hide Form" : "New Complaint"}
                    </button>
                </div>
            </div>

            {/* New Complaint Form */}
            {showForm && (
                <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-primary bg-opacity-10" style={{ pointerEvents: 'none' }}></div>
                    <div className="position-relative">
                        <h5 className="mb-3 fw-bold text-primary">Submit a Complaint</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Subject</label>
                                    <input className="form-control rounded-3 border-0 bg-white shadow-sm" name="title" placeholder="Brief title" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Category</label>
                                    <select className="form-select rounded-3 border-0 bg-white shadow-sm" name="category" required>
                                        <option value="">Choose...</option>
                                        <option value="workplace">Workplace Issue</option>
                                        <option value="salary">Salary Problem</option>
                                        <option value="leave">Leave Related</option>
                                        <option value="harassment">Harassment</option>
                                        <option value="inter-dept">Inter-department (Against Employee)</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Against Employee (Optional)</label>
                                    <select className="form-select rounded-3 border-0 bg-white shadow-sm" name="targetEmpId">
                                        <option value="">Select Employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept} - {emp.post})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <label className="form-label small fw-bold text-muted text-uppercase">Description</label>
                                    <textarea className="form-control rounded-3 border-0 bg-white shadow-sm" name="description" rows="3" placeholder="Explain your issue in detail..." required></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    <button className="btn btn-dark rounded-pill px-5" disabled={loading}>
                                        {loading ? "Submitting..." : "Submit Complaint"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Complaints List */}
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {complaints.length === 0 ? (
                    <div className="p-5 text-center text-muted">
                        No complaints yet.
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {complaints
                            .filter(c => filterCategory === "All" || c.category === filterCategory || (filterCategory === "Public Complaint" && c.title.includes("Public")))
                            .map((c) => (
                                <div key={c.id} className="list-group-item p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <h6 className="mb-0 fw-bold">{c.title}</h6>
                                                <span className={`badge ${getStatusColor(c.status)}`}>
                                                    {c.status}
                                                </span>
                                                <span className="badge bg-light text-dark border">
                                                    {c.category}
                                                </span>
                                            </div>
                                            <p className="text-muted mb-2">{c.description}</p>
                                            <div className="d-flex gap-3">
                                                <small className="text-muted">By: {c.submittedBy}</small>
                                                {c.status === "pending" && (
                                                    <small className="text-danger fw-bold">
                                                        Days Pending: {c.submittedAt?.seconds ? Math.max(1, Math.ceil((Date.now() - c.submittedAt.seconds * 1000) / 86400000)) : 1}
                                                    </small>
                                                )}
                                            </div>
                                            {c.targetEmployee && (
                                                <div className="mt-2 p-2 bg-light rounded border border-danger border-opacity-25">
                                                    <small className="text-danger fw-bold">Against: {c.targetEmployee.name} ({c.targetEmployee.dept})</small>
                                                </div>
                                            )}
                                        </div>
                                        {role === "admin" && c.status === "pending" && (
                                            <button className="btn btn-sm btn-success" onClick={() => handleResolve(c.id)}>
                                                Mark Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Grievances;
