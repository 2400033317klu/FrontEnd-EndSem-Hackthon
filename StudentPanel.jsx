import React, { useState } from "react";

const milestoneLabel = (v) => {
  const val = Number(v);
  switch (val) {
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

export default function StudentPanel({ projects, onSave, onDelete, currentUser }) {
  const emptyForm = {
    id: null,
    title: "",
    description: "",
    techStack: "",
    github: "",
    demo: "",
    milestone: 0,
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim() || form.description.length < 10) {
      e.description = "Description must be at least 10 characters.";
    }
    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z\.]{2,6})([\/\w\.-])\/?$/i;
    if (form.github && !urlRegex.test(form.github)) {
      e.github = "Invalid URL.";
    }
    if (form.demo && !urlRegex.test(form.demo)) {
      e.demo = "Invalid URL.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      ownerEmail: currentUser.email,
      milestone: Number(form.milestone),
    };
    onSave(payload);
    setForm(emptyForm);
    setErrors({});
  };

  const handleEdit = (p) => {
    setForm(p);
    setErrors({});
  };

  const myProjects = projects.filter((p) => p.ownerEmail === currentUser.email);

  return (
    <>
      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Add / Update project</div>
            <div className="card-subtitle">CRUD operations + validation on the project form.</div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Smart Attendance System" />
            {errors.title && <div className="error-text">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label>Short description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="2–3 lines about what the project does"></textarea>
            {errors.description && <div className="error-text">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label>Tech stack</label>
            <input type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node, MongoDB" />
          </div>

          <div className="form-group">
            <label>GitHub / Code URL</label>
            <input type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
            {errors.github && <div className="error-text">{errors.github}</div>}
          </div>

          <div className="form-group">
            <label>Live Demo / Video URL</label>
            <input type="url" value={form.demo} onChange={(e) => setForm({ ...form, demo: e.target.value })} placeholder="https://demo-link.com" />
            {errors.demo && <div className="error-text">{errors.demo}</div>}
          </div>

          <div className="form-group">
            <label>Current milestone</label>
            <select value={form.milestone} onChange={(e) => setForm({ ...form, milestone: e.target.value })}>
              <option value={0}>Ideation (0%)</option>
              <option value={25}>Planning & Design (25%)</option>
              <option value={50}>Development (50%)</option>
              <option value={75}>Testing (75%)</option>
              <option value={100}>Completed (100%)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            {form.id ? "Update project" : "Save project"}
          </button>
          <button type="button" className="btn btn-outline" style={{ marginLeft: 8 }} onClick={() => { setForm(emptyForm); setErrors({}); }}>
            Clear
          </button>
        </form>
        <p className="tiny" style={{ marginTop: 6 }}>
          <strong>CRUD:</strong> create, read, update and delete project entries. Validation ensures clean data.
        </p>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">My projects & milestones</div>
            <div className="card-subtitle">Data persisted in localStorage; shown with progress bars.</div>
          </div>
        </div>

        <div className="project-list">
          {myProjects.length === 0 ? (
            <div className="empty-state">No projects yet. Add one using the form.</div>
          ) : (
            myProjects.map((p) => (
              <div key={p.id} className="project-card">
                <div className="project-card-header">
                  <div>
                    <div className="project-name">{p.title}</div>
                    <div className="project-meta">Milestone: {milestoneLabel(p.milestone)}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline" style={{ padding: "4px 8px", fontSize: 11 }} onClick={() => handleEdit(p)}>Edit</button>
                    <button className="btn btn-outline" style={{ padding: "4px 8px", fontSize: 11, borderColor: "#f97373", color: "#fecaca" }} onClick={() => onDelete(p.id)}>Delete</button>
                  </div>
                </div>

                <div className="project-meta">{p.description}</div>
                <div className="tag-row">{p.techStack && <span className="tag">{p.techStack}</span>}</div>

                <div className="links">
                  {p.github && <a href={p.github} className="link-pill" target="_blank" rel="noreferrer">Code</a>}
                  {p.demo && <a href={p.demo} className="link-pill" target="_blank" rel="noreferrer">Demo</a>}
                </div>

                <div className="progress-row">
                  <span className={"badge " + (p.milestone === 100 ? "badge-success" : "")}>{p.milestone}%</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: p.milestone + "%" }}></div>
                  </div>
                </div>

                {p.status && (
                  <div className="tiny" style={{ marginTop: 4 }}>
                    Latest status from mentor: <strong>{p.status}</strong>
                    {p.feedback ? ` – ${p.feedback}` : ""}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
