import axiosInstance from "./axiosInstance";

async function registerAPI(data) {
  const res = await axiosInstance.post("/user/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

async function loginAPI(credentials) {
  const res = await axiosInstance.post("/user/login", credentials);
  return res.data; // expects { token, user: { name, role, email, ... } }
}

export { registerAPI, loginAPI };