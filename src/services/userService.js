
import apiClient from "../api/apiClient";

export const getUsers = () =>
  apiClient.get("/users");
