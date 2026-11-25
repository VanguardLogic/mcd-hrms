import { useState, useEffect } from "react";
import { getApplications, getJobPostings } from "../../backend";

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterJobId, setFilterJobId] = useState("");

    useEffect(() => {
        let active = true;
        async function loadData() {
            setLoading(true);
            const [jobData, appData] = await Promise.all([
                getJobPostings(true),
                getApplications(filterJobId || null)
            ]);

            if (!active) return;
            setJobs(jobData);

            const enhancedApps = appData.map(app => {
                const job = jobData.find(j => j.id === app.jobId);
                return { ...app, jobTitle: job ? job.title : (app.jobTitle || "Unknown Job") };
            });

            setApplications(enhancedApps);
            setLoading(false);
        }
        loadData();
        return () => {
            active = false;
        };
    }, [filterJobId]);

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0 fw-bold">Applications</h2>
                <div style={{ width: "250px" }}>
                    <select
                        className="form-select"
                        value={filterJobId}
                        onChange={(e) => setFilterJobId(e.target.value)}
                    >
                        <option value="">All Jobs</option>
                        {jobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : applications.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <h4>No Applications Found</h4>
                    <p>There are no candidates for the selected criteria.</p>
                </div>
            ) : (
                <div className="card shadow-sm border-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 ps-4">Candidate</th>
                                    <th className="border-0">Applied For</th>
                                    <th className="border-0">Contact</th>
                                    <th className="border-0">Date</th>
                                    <th className="border-0 text-end pe-4">Resume</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold">{app.name}</div>
                                            <div className="text-muted small">{app.email}</div>
                                        </td>
                                        <td>
                                            <span className="badge bg-primary bg-opacity-10 text-primary">
                                                {app.jobTitle}
                                            </span>
                                        </td>
                                        <td>{app.phone}</td>
                                        <td>
                                            {app.submittedAt?.seconds
                                                ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString()
                                                : "Just now"}
                                        </td>
                                        <td className="text-end pe-4">
                                            {app.resumeLink ? (
                                                <a
                                                    href={app.resumeLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    View Resume
                                                </a>
                                            ) : (
                                                <span className="text-muted small">Not provided</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
