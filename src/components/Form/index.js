import React from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import { Grid } from "@mui/material";
import { TextField, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
const Form = ({
  register,
  handleSubmit,
  formItems,
  title,
  errors,
  onSubmit,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const large = useMediaQuery(theme.breakpoints.up("1500"));
  const small = useMediaQuery(theme.breakpoints.down("599"));
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const navigation = () => {
    if (title === "SignUp") {
      navigate("/login", { replace: true });
    } else {
      navigate("/signup", { replace: true });
    }
  };

  const inputs = () => {
    const arr = [];
    for (let key in formItems) {
      arr.push(
        <Grid
          key={key}
          xs={12}
          sx={{ alignSelf: "center", marginBottom: "30px", width: "70%" }}
          item>
          <TextField
            sx={{
              margin: "auto",
              color: "black",
              transition: "opacity 0.25s ease-out !important",
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
            label={formItems[key].label}
            type={formItems[key].type}
            error={errors?.[key]}
            helperText={errors?.[key]?.message}
            placeholder={formItems[key].placeholder}
            InputLabelProps={{
              shrink: true,
            }}
            variant="standard"
            {...register(formItems[key].name, {
              required: formItems[key].required,
              validate: formItems[key]?.validate,
            })}
          />
        </Grid>
      );
    }
    return arr;
  };
  return (
    <Grid
      sx={{
        minHeight: "100vh",
        m: 0,
        p: 0,
        background:
          "linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
      }}
      justifyContent="center"
      container>
      <Grid
        sx={{ margin: "auto 0" }}
        xs={12}
        sm={9}
        md={5}
        lg={!large ? 4 : 3}
        item>
        <Box
          sx={{
            width: "100%",
            minHeight: "200px",
            background: "white",
            height: `${small ? "100vh" : "unset"}`,
            borderRadius: `${small ? 0 : "20px"}`,
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}>
          <Typography
            sx={{
              textAlign: "center",
              padding: "40px 0",
              fontWeight: "bold",
            }}
            variant="h4">
            {title === "LogIn" ? "Login" : "Sign Up"}
          </Typography>
          {loading === "failed" && error !== "" ? (
            <p
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
              }}>
              {error}
            </p>
          ) : null}
          <Grid
            direction={"column"}
            justifyContent={"center"}
            sx={{ marginTop: "20px" }}
            container>
            {inputs()}
            <Grid
              item
              sx={{ alignSelf: "center", marginBottom: "30px", width: "73%" }}
              xs={12}>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                sx={{
                  width: "100%",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  color: "white",
                  background:
                    "linear-gradient(135deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)",
                  "&:hover": {
                    transform: "translateY(2px)",
                    boxShadow: "5px 5px 5px rgba(68, 68, 68, 0.6)",
                  },
                  "&:active": {
                    transform: "translateX(1px)",
                    outline: "none",
                  },
                }}>
                {title === "SignUp" ? "Sign Up" : "Log In"}
              </Button>
            </Grid>

            <Grid
              item
              sx={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: "20px",
                paddingBottom: "100px",
                width: "73%",
              }}
              xs={12}>
              <label
                onClick={() => navigation()}
                style={{
                  color: "#007bff",
                  cursor: "pointer",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}>
                {title === "LogIn"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </label>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};
export default Form;
