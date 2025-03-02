import { css } from "@mui/material-pigment-css";

export const sidebar = css({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
});

export const list = css(({ theme }) => ({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  rowGap: theme.spacing(1),
}));
