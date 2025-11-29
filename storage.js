export const STORAGE_KEYS = {
  PROJECTS: "ep_projects",
  USERS: "ep_users",
  CURRENT_USER: "ep_current_user",
};

export const loadProjects = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return raw ? JSON.parse(raw) : [];
};

export const saveProjects = (data) =>
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data));

export const loadUsers = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
};

export const saveUsers = (data) =>
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data));
