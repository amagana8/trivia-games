import { Button, TextField, Typography } from "@mui/material";
import { produce } from "immer";
import { useAtomValue, useSetAtom } from "jotai";
import { memo, type FC } from "react";
import { gridGameAtom } from "../../../../atoms/gridGame";
import { isEditingAtom } from "../../../../atoms/isEditing";
import { QuestionCard } from "../../QuestionCard/QuestionCard";
import { QuestionSlot } from "../QuestionSlot/QuestionSlot";
import * as styles from "./Column.styles";

const Column: FC<{
  category: string;
  questions: string[];
  categoryIndex: number;
}> = memo(({ category, questions, categoryIndex }) => {
  const isEditing = useAtomValue(isEditingAtom);
  const setGridGame = useSetAtom(gridGameAtom);

  return (
    <div className={styles.column}>
      {isEditing ? (
        <TextField />
      ) : (
        <Typography variant="h3">{category}</Typography>
      )}
      {questions.map((questionId, index) => (
        <QuestionSlot
          key={index}
          categoryIndex={categoryIndex}
          questionIndex={index}
        >
          {questionId && <QuestionCard questionId={questionId} />}
        </QuestionSlot>
      ))}
      {isEditing && (
        <>
        <Button
          onClick={() => {
            setGridGame(
              produce((draft) => {
                draft[categoryIndex].questions.push("");
              })
            );
          }}
        >
          Add Question
        </Button>
        <Button
          onClick={() => {
            setGridGame(
              produce((draft) => {
                draft[categoryIndex].questions.pop();
              })
            );
          }}
        >
          Remove Question
        </Button>
        </>
      )}
    </div>
  );
});

export { Column };
