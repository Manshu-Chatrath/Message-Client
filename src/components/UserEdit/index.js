import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  editProfile,
  defaultLoader,
  uploadPicture,
  getSignedInUser,
} from "reducers/userSlice";
import { useNavigate } from "react-router";

import UploadIcon from "@mui/icons-material/Upload";
import { useForm } from "react-hook-form";
import Loader from "components/Loader";
const UserEdit = ({ setEdit, userId, user }) => {
  const handleClick = () => {
    setEdit(false);
  };
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const loading = useSelector((state) => state.users.loading);
  const imageUploadMessage = useSelector(
    (state) => state.users.uploadImageMessage
  );

  useEffect(() => {
    if (imageUploadMessage === "success") {
      dispatch(getSignedInUser());
    }
  }, [imageUploadMessage]);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    return () => dispatch(defaultLoader());
  }, []);

  const onSubmit = (data) => {
    if (data?.password === "") {
      delete data.password;
    }
    if (data?.password?.length < 5) {
      setError("password", {
        message: "Password length should be more than 5",
      });
      return;
    }
    if (data.src === "") {
      delete data.src;
    }
    dispatch(editProfile({ ...data, id: userId }));
  };

  const form = {
    password: {
      name: "password",
      type: "password",
    },

    src: {
      name: "src",
      type: "password",
    },
  };

  const handleEnter = () => setIsVisible(true);
  const navigate = useNavigate();
  const handleLeave = () => setIsVisible(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    dispatch(uploadPicture({ file, imageId: user.imageUuid }));
  };
  const handleFileButtonClicked = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <input
        style={{ display: "none" }}
        type="file"
        accept="image/*"
        id="fileInput"
        onChange={handleFileChange}
      />
      {loading === "inProgress" ? <Loader /> : null}
      {loading === "success" ? (
        <Loader success={true} handleClick={handleClick} />
      ) : null}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <ArrowBackIosIcon
            onClick={handleClick}
            sx={{ marginTop: " 20px", marginLeft: "20px", cursor: "pointer" }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            onClick={handleLogOut}
            sx={{ marginTop: " 20px", marginRight: "20px", cursor: "pointer" }}>
            LogOut
          </Button>
        </Box>
      </Box>

      <Box
        onMouseEnter={handleEnter}
        sx={{
          position: "relative",
          background: `url(${
            user?.src
              ? user.src
              : `https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-user-image-179582665.jpg`
          })`,
          height: "150px",
          margin: "auto",
          marginTop: "40px",
          width: "150px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "50%",
        }}>
        {isVisible ? (
          <Box
            onMouseLeave={handleLeave}
            onClick={handleFileButtonClicked}
            sx={{
              position: "absolute",
              height: "150px",
              borderRadius: "50%",
              width: "150px",
              top: 0,
              left: 0,
              zIndex: 3,
              display: "flex",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(0, 0, 0, 0.5)",
            }}>
            <Box>
              <Typography sx={{ color: "white", margin: "auto" }}>
                Upload
              </Typography>
            </Box>
            <Box sx={{ color: "white" }}>
              <UploadIcon />
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box sx={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
        <Typography variant="span">Edit Information</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "40px",
          rowGap: "30px",
        }}>
        <Box sx={{ width: "80%", margin: "auto" }}>
          <TextField
            sx={{
              width: "100%",
              "& .MuiFormLabel-root": {
                color: "rgba(187,187,187,0.9) !important",
                fontWeight: "bold",
              },
              "& .Mui-focused": {
                color: "black",
              },
              "& .MuiFormHelperText-root": {
                color: "red",
                fontWeight: "bold",
              },
            }}
            label="Enter new Password"
            type="password"
            helperText={errors?.password?.message}
            id="outlined-basic"
            variant="outlined"
            {...register(form.password.name)}
          />
        </Box>
      </Box>
      <Box sx={{ margin: "auto", width: "80%", marginTop: "50px" }}>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          sx={{ width: "100%" }}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default UserEdit;
