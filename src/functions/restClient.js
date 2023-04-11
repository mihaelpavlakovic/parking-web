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
    throw error;
  }
};

const get = async url => {
  try {
    const response = await client.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { client, setHeaders, post, get };
