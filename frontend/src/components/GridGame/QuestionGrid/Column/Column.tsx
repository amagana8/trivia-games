import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton, TextField, Typography } from '@mui/material';
import { produce } from 'immer';
import { useAtomValue, useSetAtom } from 'jotai';
import { memo } from 'react';

import { gridGameAtom } from '../../../../atoms/gridGame';
import { isEditingAtom } from '../../../../atoms/isEditing';
import { QuestionCard } from '../../QuestionCard/QuestionCard';
import { QuestionSlot } from '../QuestionSlot/QuestionSlot';
import * as styles from './Column.styles';

const Column: React.FC<{
  category: string;
  questions: string[];
  categoryIndex: number;
}> = memo(({ category, questions, categoryIndex }) => {
  const isEditing = useAtomValue(isEditingAtom);
  const setGridGame = useSetAtom(gridGameAtom);

  return (
    <div className={styles.column}>
      {isEditing ? (
        <TextField
          value={category}
          variant="standard"
          placeholder="Category"
          onChange={(e) =>
            setGridGame(
              produce((draft) => {
                draft.grid[categoryIndex].category = e.target.value;
              }),
            )
          }
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
          <IconButton
            onClick={() => {
              setGridGame(
                produce((draft) => {
                  draft.grid[categoryIndex].questions.pop();
                }),
              );
            }}
          >
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              setGridGame(
                produce((draft) => {
                  draft.grid[categoryIndex].questions.push('');
                }),
              );
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
});

export { Column };
