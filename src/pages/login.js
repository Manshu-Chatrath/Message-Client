import React, { useEffect } from "react";
import Form from "components/Form";
import Loader from "components/Loader";
import { useNavigate } from "react-router-dom";
import { loginUser, defaultLoader } from "reducers/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { isExpired } from "react-jwt";
import { getSignedInUser } from "reducers/userSlice";
const LogIn = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm();

  const loading = useSelector((state) => state.auth.loading);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (loading === "success" && !isExpired(token)) {
      dispatch(getSignedInUser());
      navigate("/", { replace: true });
    }
  }, [token, loading]);

  useEffect(() => {
    return () => dispatch(defaultLoader());
  }, []);

  const title = "LogIn";
  const form = {
    email: {
      label: "Email",
      name: "email",

      required: "Please enter your email",
      placeholder: "Enter your email",
      type: "email",
    },
    password: {
      label: "Password",
      name: "password",

      required: "Please enter your password",
      placeholder: "Enter your password",
      type: "password",
    },
  };
  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };
  return (
    <>
      {loading === "inProgress" ? <Loader /> : null}
      <Form
        title={title}
        formItems={form}
        register={register}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
export default LogIn;
