import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { memo } from "react";
import { trpc } from "../../../../trpc";
import * as styles from "./QuestionDialog.styles";

export const QuestionDialog: React.FC<{ onClose: () => void }> = memo(
  ({ onClose }) => {
    const createQuestion = trpc.question.createQuestion.useMutation();

    return (
      <Dialog
        open
        onClose={onClose}
        PaperProps={{
          component: "form",
          onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            createQuestion.mutate({
              query: String(formData.get("query")),
              answer: String(formData.get("answer")),
              authorId: "672ae769cb6a1ba56cd5b7a6",
            });
            onClose();
          },
        }}
      >
        <DialogTitle>New Question</DialogTitle>

        <DialogContent className={styles.dialogForm}>
          <TextField placeholder="question" name="query" />
          <TextField placeholder="answer" name="answer" />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);
