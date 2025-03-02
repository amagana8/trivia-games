import Add from "@mui/icons-material/Add";
import {
  Button,
  Typography
} from "@mui/material";
import { useAtomValue } from "jotai";
import { FC, memo, useMemo, useState } from "react";
import { usedQuestionsAtom } from "../../../atoms/gridGame";
import { trpc } from "../../../trpc";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import * as styles from "./QuestionBank.styles";
import { QuestionDialog } from "./QuestionDialog/QuestionDialog";

export const QuestionBank: FC = memo(() => {
  const { data, isPending, isError } = trpc.question.getAllQuestions.useQuery();
  const usedQuestions = useAtomValue(usedQuestionsAtom);
  const [isOpen, setIsOpen] = useState(false);

  const availableQuestions = useMemo(() => {
    if (!data) {
      return [];
    }
    return Object.keys(data.questionMap).filter(
      (questionId) => !usedQuestions.has(questionId)
    );
  }, [data?.questionMap, usedQuestions]);

  if (isPending) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return <Typography>Error occured</Typography>;
  }

  return (
    <aside className={styles.sidebar}>
      <Typography variant="h4">Questions</Typography>

      <div className={styles.list}>
        {availableQuestions.map((questionId) => (
          <QuestionCard questionId={questionId} key={questionId} />
        ))}
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
