export const persistAuth = (token, role, data) => {
  if (token) localStorage.setItem("token", token);
  if (role) localStorage.setItem("role", role);
  if (data) localStorage.setItem("data", data);

  window.dispatchEvent(new Event("storage"));
};
