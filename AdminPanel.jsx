import React from "react";

export default function AdminPanel({ projects, onStatusChange, onDelete }) {
  const hasProjects = projects.length > 0;

  const milestoneLabel = (v) => {
    switch (Number(v)) {
      case 0:
        return "Ideation";
      case 25:
        return "Planning & Design";
      case 50:
        return "Development";
      case 75:
        return "Testing";
      case 100:
        return "Completed";
      default:
        return "Unknown";
    }
  };

  return (
    <>
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Admin guide</div>
            <div className="card-subtitle">Review student portfolios, track progress and give feedback.</div>
          </div>
        </div>
        <p className="tiny">This panel explains the <strong>admin workflow and routing.</strong> Admin logs in, lands on the admin dashboard, sees all projects and can update status or feedback.</p>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Portfolio submissions</div>
            <div className="card-subtitle">Each row = one student project with milestone + feedback.</div>
          </div>
        </div>

        <div style={{ maxHeight: 430, overflowY: "auto", paddingRight: 3 }}>
          {!hasProjects ? (
            <div className="empty-state">No submissions yet. Ask students to add projects.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Milestone</th>
                  <th>Status</th>
                  <th>Feedback</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="project-name">{p.title}</div>
                      <div className="project-meta">{p.techStack} • {p.ownerEmail}</div>
                      <div className="links" style={{ marginTop: 4 }}>
                        {p.github && <a href={p.github} className="link-pill" target="_blank" rel="noreferrer">Code</a>}
                        {p.demo && <a href={p.demo} className="link-pill" target="_blank" rel="noreferrer">Demo</a>}
                      </div>
                    </td>
                    <td>
                      <span className="badge">{p.milestone}%</span>
                      <div className="tiny">{milestoneLabel(p.milestone)}</div>
                    </td>
                    <td>
                      <select value={p.status || "pending"} onChange={(e) => onStatusChange(p.id, { status: e.target.value })}>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="changes">Changes required</option>
                      </select>
                      <div style={{ marginTop: 4 }}>
                        <span className={"status-pill " + (p.status === "approved" ? "status-approved" : p.status === "changes" ? "status-changes" : "status-pending")}>
                          {p.status || "pending"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <textarea rows="2" style={{ width: "100%" }} value={p.feedback || ""} onChange={(e) => onStatusChange(p.id, { feedback: e.target.value })} placeholder="Short feedback..."></textarea>
                    </td>
                    <td>
                      <button className="btn btn-outline" style={{ padding: "3px 7px", fontSize: 10, borderColor: "#f97373", color: "#fecaca" }} onClick={() => onDelete(p.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
