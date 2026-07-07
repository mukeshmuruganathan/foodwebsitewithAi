import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../redux/actions/userActions";
import { clearErrors } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, loading, success } = useSelector((state) => state.user);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Password reset successfully!");
      navigate("/users/login");
      dispatch(clearErrors());
    }
  }, [dispatch, error, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      return toast.error("Passwords do not match");
    }
    dispatch(resetPassword(token, { password, passwordConfirm }));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h1 className="mb-3">New Password</h1>

              <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm_password_field">Confirm Password</label>
                <input
                  type="password"
                  id="confirm_password_field"
                  className="form-control"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </div>

              <button
                id="new_password_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading ? true : false}
              >
                Set Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NewPassword;
