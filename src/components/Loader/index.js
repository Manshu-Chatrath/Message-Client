import React, { useState } from "react";
import { Button, Typography, Modal } from "@mui/material";
import { CircularProgress, Popover, Grid, Box } from "@mui/material";
const Loader = ({ isOpen = true, success = false, handleClick }) => {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    handleClick();
  };
  return (
    <>
      {success ? (
        <Modal
          open={open}
          style={{
            background: "rgb(0,0,0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClose={handleClose}>
          <Box
            sx={{
              minWidth: "200px",
              borderRadius: "10px",
              height: "auto",
              padding: "20px",
              textAlign: "center",
              background: "white",
            }}>
            <Typography
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "10px",
                fontSize: "18px",
              }}>
              Success
            </Typography>
            <Button
              sx={{ margin: "auto", borderRadius: "20px", fontWeight: "bold" }}
              variant="contained"
              onClick={handleClick}>
              Ok
            </Button>
          </Box>
        </Modal>
      ) : (
        <Popover
          open={isOpen}
          anchorReference={"none"}
          style={{
            background: "rgb(0,0,0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box sx={{ minWidth: "200px", height: "60px", borderRadius: "10px" }}>
            <Grid
              justifyContent={"center"}
              alignItems="center"
              sx={{ height: "100%" }}
              container>
              <Grid item>Loading...</Grid>
              <Grid item sx={{ marginLeft: "10px" }}>
                <CircularProgress size={25} />
              </Grid>
            </Grid>
          </Box>
        </Popover>
      )}
    </>
  );
};

export default Loader;
