import Add from "@mui/icons-material/Add";
import { Button, Typography } from "@mui/material";
import { useAtomValue } from "jotai";
import { FC, memo, Suspense, useState } from "react";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import * as styles from "./QuestionBank.styles";
import { QuestionDialog } from "./QuestionDialog/QuestionDialog";
import { availableQuestionsAtom } from "../../../atoms/questions";

export const QuestionBank: FC = memo(() => {
  const availableQuestions = useAtomValue(availableQuestionsAtom);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <Typography variant="h4">Questions</Typography>

      <div className={styles.list}>
        <Suspense fallback={<div>Loading...</div>}>
        {availableQuestions.map((questionId) => (
          <QuestionCard questionId={questionId} key={questionId} />
        ))}
        </Suspense>
      </div>

      <Button
        startIcon={<Add />}
        variant="outlined"
        onClick={() => setIsOpen(true)}
      >
        Question
      </Button>

      {isOpen && <QuestionDialog onClose={() => setIsOpen(false)} />}
    </aside>
  );
});
