import { css } from "@mui/material-pigment-css";

export const dialogForm = css(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
}));

export const embedLinkInput = css({
  flex: 1,
});
