import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton, TextField, Typography } from '@mui/material';
import { useAtomInstance } from '@zedux/react';
import { memo } from 'react';

import { gridGameAtom } from '../../../../atoms/gridGame';
import { QuestionCard } from '../../QuestionCard/QuestionCard';
import { QuestionSlot } from '../QuestionSlot/QuestionSlot';
import * as styles from './Column.styles';

const Column: React.FC<{
  category: string;
  questions: string[];
  categoryIndex: number;
  isEditing: boolean;
  gridGameId: string;
}> = memo(({ category, questions, categoryIndex, isEditing, gridGameId }) => {
  const { editCategoryTitle, popQuestion, pushQuestion } = useAtomInstance(
    gridGameAtom,
    [gridGameId],
  ).exports;

  return (
    <div className={styles.column}>
      {isEditing ? (
        <TextField
          defaultValue={category}
          variant="standard"
          placeholder="Category"
          onChange={(e) => editCategoryTitle(categoryIndex, e.target.value)}
        />
      ) : (
        <Typography variant="h3">{category}</Typography>
      )}

      {questions.map((questionId, index) => (
        <QuestionSlot
          key={index}
          categoryIndex={categoryIndex}
          questionIndex={index}
        >
          {questionId ? (
            <QuestionCard questionId={questionId} />
          ) : (
            <Typography color="textDisabled">{index + 1}00</Typography>
          )}
        </QuestionSlot>
      ))}
      {isEditing && (
        <div className={styles.controls}>
          <IconButton onClick={() => popQuestion(categoryIndex)}>
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton onClick={() => pushQuestion(categoryIndex)}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
});

export { Column };
