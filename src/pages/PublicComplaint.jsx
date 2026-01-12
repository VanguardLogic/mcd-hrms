import { useState, useEffect } from "react";
import { getPublicEmployees, submitGrievance } from "../backend";

function PublicComplaint({ onBack }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [targetEmpId, setTargetEmpId] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("Public Complaint");

    useEffect(() => {
        async function fetchEmployees() {
            try {
                const data = await getPublicEmployees();
                setEmployees(data);
            } catch (error) {
                console.error("Failed to load employees", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const selectedEmp = employees.find(e => e.id === targetEmpId);
            const submittedBy = `${name} (${contact})`;

            await submitGrievance(
                "Public Complaint Against Employee", // Title
                description,
                category,
                submittedBy,
                selectedEmp ? { id: selectedEmp.id, name: selectedEmp.name, dept: selectedEmp.dept } : null
            );

            alert("Complaint submitted successfully. Thank you for your feedback.");
            onBack();
        } catch (error) {
            alert("Error submitting complaint: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center p-4" style={{ background: "#f8f9fa" }}>
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: "600px", width: "100%" }}>
                <div className="card-header bg-danger text-white p-4 text-center">
                    <h4 className="fw-bold mb-0">Public Grievance Redressal</h4>
                    <p className="small mb-0 opacity-75">Report issues directly to the administration</p>
                </div>
                <div className="card-body p-4 p-md-5">
                    <button className="btn btn-link text-decoration-none text-muted mb-3 p-0" onClick={onBack}>
                        ← Back to Login
                    </button>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-muted">Your Name</label>
                                <input
                                    className="form-control"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small fw-bold text-muted">Contact (Phone/Email)</label>
                                <input
                                    className="form-control"
                                    value={contact}
                                    onChange={e => setContact(e.target.value)}
                                    required
                                    placeholder="How can we reach you?"
                                />
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">Complaint Against (Employee)</label>
                                {loading ? (
                                    <div className="text-muted small">Loading employees...</div>
                                ) : (
                                    <select
                                        className="form-select"
                                        value={targetEmpId}
                                        onChange={e => setTargetEmpId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select Employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>
                                                {emp.name} ({emp.dept} - {emp.post})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">Issue Category</label>
                                <select
                                    className="form-select"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="Public Complaint">General Complaint</option>
                                    <option value="Misbehavior">Misbehavior</option>
                                    <option value="Corruption">Corruption / Bribe</option>
                                    <option value="Delay">Delay in Work</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label small fw-bold text-muted">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Please describe the incident in detail..."
                                    required
                                ></textarea>
                            </div>

                            <div className="col-12 mt-4">
                                <button type="submit" className="btn btn-danger w-100 py-2 fw-bold" disabled={submitting}>
                                    {submitting ? "Submitting..." : "Submit Complaint"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PublicComplaint;
