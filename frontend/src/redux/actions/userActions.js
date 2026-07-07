//Dispatch => Call API =>Update state based on success or failure

import api from "../../utils/api";
import {
  loginRequest,
  loginSuccess,
  loginFail,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  updateReset,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  newPasswordRequest,
  newPasswordSuccess,
  newPasswordFail,
  clearErrors,
} from "../slices/userSlice";

// LOGIN

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());
    const { data } = await api.post("/v1/users/login", {
      email,
      password,
    });
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail("login Failed "));
  }
};

//Register
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await api.post("/v1/users/signup", userData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(loginSuccess(data.data.user));
  } catch (error) {
    dispatch(loginFail(error.response?.data?.message || error.response?.data?.errMessage || "Registration failed"));
  }
};

//load user
export const loadUser = () => async (dispatch) => {
  // try{
  //     dispatch(loginRequest())

  //     const {data} = await api.get("/v1/users/me")

  //     dispatch(loginSuccess(data.user))

  // }catch(error){
  //     dispatch(loadUserFail(error.response?.data?.message))
  // }

  try {
    dispatch(loginRequest());

    const { data } = await api.get("/v1/users/me");

    console.log("loadUser response:", data);

    dispatch(loginSuccess(data.user));
  } catch (error) {
    console.log("loadUser error:", error.response);

    dispatch(loadUserFail(error.response?.data?.message));
  }
};

//update profile

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());

    const { data } = await api.put("/v1/users/me/update", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(data.success));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message));
  }
};

//logout
export const logout = () => async (dispatch) => {
  try {
    await api.get("v1/users/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail(error.response?.data?.message));
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await api.post("v1/users/forgetPassword", { email }, {
      headers: { "Content-Type": "application/json" }
    });
    dispatch(forgotPasswordSuccess(data.message));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response?.data?.message || "Something went wrong"));
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch(newPasswordRequest());
    const { data } = await api.patch(`v1/users/resetPassword/${token}`, passwords, {
      headers: { "Content-Type": "application/json" }
    });
    dispatch(newPasswordSuccess(data.success));
  } catch (error) {
    dispatch(newPasswordFail(error.response?.data?.message || "Something went wrong"));
  }
};

