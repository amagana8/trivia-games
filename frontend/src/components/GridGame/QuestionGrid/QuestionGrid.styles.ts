import { css } from "@mui/material-pigment-css";

export const gridControls = css(() => ({
  display: "flex",
  alignItems: "center",
}));

export const root = css(() => ({
  display: 'flex',
  gridArea: 'main',
  overflow: 'auto',
}));
