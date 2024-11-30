import { Typography } from "@mui/material";
import { FC, memo, useMemo } from "react";
import { trpc } from "../../../trpc";
import { QuestionCard } from "../QuestionCard/QuestionCard";
import * as styles from "./QuestionBank.styles";
import { usedQuestionsAtom } from "../../../atoms/gridGame";
import { useAtomValue } from "jotai";

export const QuestionBank: FC = memo(() => {
  const { data, isPending, isError } = trpc.question.getAllQuestions.useQuery();
  const usedQuestions = useAtomValue(usedQuestionsAtom);

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
    </aside>
  );
});
