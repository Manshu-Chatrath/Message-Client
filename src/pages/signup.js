import React, { useState, useEffect } from "react";
import Form from "components/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { signUpUser, defaultLoader } from "reducers/authSlice";
import Loader from "components/Loader";
const SignUp = () => {
  const loading = useSelector((state) => state.auth.loading);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const form = {
    email: {
      label: "Email",
      name: "email",
      placeholder: "Enter your email",
      required: "Please enter your email!",
      type: "email",
    },
    name: {
      label: "Name",
      name: "name",
      placeholder: "Enter your name",
      required: "Please enter your name!",
    },
    password: {
      label: "Password",
      name: "password",
      placeholder: "Enter your password",
      required: "Please enter your password!",
      type: "password",
    },
    confirmPassword: {
      label: "Confirm Password",
      type: "password",
      name: "confirmPassword",
      placeholder: "Confirm password",
      required: "Please confirm your password!",
      validate: (value) => {
        return value === watch("password") || "The password does not match";
      },
    },
  };
  const dispatch = useDispatch();
  const title = "SignUp";
  const navigate = useNavigate();

  useEffect(() => {
    return () => dispatch(defaultLoader());
  }, []);

  const handleClick = () => {
    navigate("/login", { replace: true });
  };

  const onSubmit = (data) => {
    delete data.confirmPassword;
    dispatch(signUpUser(data));
  };

  return (
    <>
      {loading === "inProgress" ? <Loader /> : null}
      {loading === "success" ? (
        <Loader success={true} handleClick={handleClick} />
      ) : null}
      <Form
        title={title}
        errors={errors}
        formItems={form}
        register={register}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
export default SignUp;
