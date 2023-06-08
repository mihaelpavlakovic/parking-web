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
      console.log("Error response:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received");
    } else {
      // Something happened in setting up the request that triggered an error
      console.log("Error setting up request");
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
      console.log("Error response:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received");
    } else {
      // Something happened in setting up the request that triggered an error
      console.log("Error setting up request");
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
      console.log("Error response:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received");
    } else {
      // Something happened in setting up the request that triggered an error
      console.log("Error setting up request");
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
      console.log("Error response:", error.response.data);
      console.log("Status code:", error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response received");
    } else {
      // Something happened in setting up the request that triggered an error
      console.log("Error setting up request");
    }
  }
};

export { client, setHeaders, post, get, putReq, del };
