import axiosInstance from "./axiosInstance";

async function registerAPI (data){
    const res = await axiosInstance.post('/user/register',data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    return res.data
}

export {registerAPI}