import axios from "axios";

const server = axios.create({
  baseURL: process.env.BASE_URL,
  fetchOptions: {
    cache: "no-cache",
  },
});

export default server;
