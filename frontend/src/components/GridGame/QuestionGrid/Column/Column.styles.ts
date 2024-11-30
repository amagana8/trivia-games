import { css } from "@mui/material-pigment-css";

export const column = css(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    rowGap: theme.spacing(2),
    width: "12em",
}));