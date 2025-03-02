import { css } from "@mui/material-pigment-css";

export const columnControls = css(() => ({
  display: "flex",
  alignSelf: "center",
}));

export const footer = css(({theme}) => ({
  backgroundColor:theme.palette.secondary,
  width: "100%",
  display: "flex",
  alignSelf: "flex-end",
  justifyContent: "flex-end",
}));
