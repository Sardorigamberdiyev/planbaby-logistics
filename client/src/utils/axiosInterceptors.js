import axios from "axios";

axios.interceptors.request.use(
  config => {
    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const token = userData ? userData.token : undefined;
    config.headers = {
      authorization: `Bearer ${token}`,
    };

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalConfig = error.config;
    const responseStatus = error.response.status;

    if (responseStatus === 401) {
      window.localStorage.removeItem("userData");
      return Promise.reject(error);
    }

    const userData = JSON.parse(window.localStorage.getItem("userData"));
    const refreshToken = userData ? userData.rToken : null;

    try {
      if (responseStatus === 403 && !originalConfig._retry) {
        originalConfig._retry = true;

        const result = await fetch("/api/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: refreshToken }),
        });

        const response = await result.json();

        const { accessToken } = response;
        window.localStorage.setItem(
          "userData",
          JSON.stringify({ ...userData, token: accessToken }),
        );

        return axios(originalConfig);
      }
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.reject(error);
  },
);

export default axios;
