import { css } from "@mui/material-pigment-css";

export const sidebar = css({
  height: "100vh",
});

export const list = css(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  rowGap: theme.spacing(1),
}));
