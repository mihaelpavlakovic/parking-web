// import { LOGIN } from "./authSlice";

// library imports
import axios from "axios";

export const login = ({ email, password }) => {
  return async dispatch => {
    console.log(email, password);
    axios
      .post("/users/login", {
        email: email,
        password: password,
      })
      .then(response => {
        console.log(response);
        // dispatch(LOGIN({user: response}))
      })
      .catch(error => {
        console.log(error);
      });
  };
};
