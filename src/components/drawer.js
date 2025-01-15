import React from "react";
import PropTypes from "prop-types";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

const drawerBleeding = 56;

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor: grey[100],
}));

const StyledBox = styled("div")(({ theme }) => ({
  backgroundColor: "#fff",
}));

const Puller = styled("div")(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

function SwipeableEdgeDrawer({ onPlayWithSociapa, window }) {
  const [open, setOpen] = React.useState(true);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const container = window !== undefined ? () => window().document.body : undefined;


  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <SwipeableDrawer
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={onPlayWithSociapa} // Call parent callback
          style={{ margin: "20px" }}
        >
          Play with Sociapa
        </Button>
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
        </StyledBox>
        <StyledBox sx={{ px: 2, pb: 2, height: "100%", overflow: "auto" }}>
          {/* <Skeleton variant="rectangular" height="100%" /> */}
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );

}

SwipeableEdgeDrawer.propTypes = {
  onPlayWithSociapa: PropTypes.func.isRequired, // Add callback prop type
  window: PropTypes.func,
};

export default SwipeableEdgeDrawer;
