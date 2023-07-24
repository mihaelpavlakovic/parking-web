import axios from "axios";
import { baseURL } from "../enviroment";

const token = localStorage.getItem("token");

const client = axios.create({
  baseURL,
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

const setHeaders = token => {
  client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.setItem("token", token);
};

const post = async (url, data) => {
  try {
    const response = await client.post(url, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const response = {
        error: true,
        message: error.response.data,
      };

      return response;
    } else if (error.request) {
      // The request was made but no response was received
      const response = {
        error: true,
        message: "No response received",
      };

      return response;
    } else {
      // Something happened in setting up the request that triggered an error
      const response = {
        error: true,
        message: "Error setting up request",
      };

      return response;
    }
  }
};

const get = async url => {
  try {
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const response = {
        error: true,
        message: error.response.data,
      };

      return response;
    } else if (error.request) {
      // The request was made but no response was received
      const response = {
        error: true,
        message: "No response received",
      };

      return response;
    } else {
      // Something happened in setting up the request that triggered an error
      const response = {
        error: true,
        message: "Error setting up request",
      };

      return response;
    }
  }
};

const putReq = async (url, data) => {
  try {
    const response = await client.put(url, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const response = {
        error: true,
        message: error.response.data,
      };

      return response;
    } else if (error.request) {
      // The request was made but no response was received
      const response = {
        error: true,
        message: "No response received",
      };

      return response;
    } else {
      // Something happened in setting up the request that triggered an error
      const response = {
        error: true,
        message: "Error setting up request",
      };

      return response;
    }
  }
};

const del = async url => {
  try {
    const response = await client.delete(url);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      const response = {
        error: true,
        message: error.response.data,
      };

      return response;
    } else if (error.request) {
      // The request was made but no response was received
      const response = {
        error: true,
        message: "No response received",
      };

      return response;
    } else {
      // Something happened in setting up the request that triggered an error
      const response = {
        error: true,
        message: "Error setting up request",
      };

      return response;
    }
  }
};

export { client, setHeaders, post, get, putReq, del };
