import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton, TextField, Typography } from '@mui/material';
import { useAtomInstance, useAtomValue } from '@zedux/react';
import { memo, useEffect } from 'react';

import { gridGameAtom } from '../../../atoms/gridGame';
import { Column } from './Column/Column';
import { getGridGame } from './getters';
import * as styles from './QuestionGrid.styles';

export const QuestionGrid: React.FC<{
  isEditing?: boolean;
  gridGameId: string;
  gameRoomId?: string;
}> = memo(({ isEditing = false, gridGameId, gameRoomId }) => {
  const gridGame = useAtomValue(getGridGame, [gridGameId, gameRoomId]);
  const { moveQuestion, changeTitle, popColumn, pushColumn } = useAtomInstance(
    gridGameAtom,
    [gridGameId],
  ).exports;

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const origin = location.initial.dropTargets[0];
        const destination = location.current.dropTargets[0];

        moveQuestion(
          String(source.data.questionId),
          origin
            ? {
                categoryIndex: Number(origin.data.categoryIndex),
                questionIndex: Number(origin.data.questionIndex),
              }
            : undefined,
          destination
            ? {
                categoryIndex: Number(destination?.data.categoryIndex),
                questionIndex: Number(destination?.data.questionIndex),
              }
            : undefined,
        );
      },
    });
  }, []);

  return (
    <div className={styles.root}>
      <div>
        {isEditing ? (
          <TextField
            value={gridGame.title}
            onChange={(e) => changeTitle(e.target.value)}
            variant="standard"
            placeholder="Title"
          />
        ) : (
          <Typography variant="h3">Title</Typography>
        )}

        <div style={{ columnGap: '1rem', display: 'flex' }}>
          {gridGame.grid.map(({ category, questions }, index) => (
            <Column
              key={index}
              category={category}
              questions={questions}
              categoryIndex={index}
              isEditing={isEditing}
              gridGameId={gridGameId}
            />
          ))}
        </div>
      </div>

      {isEditing && (
        <div className={styles.gridControls}>
          <IconButton onClick={popColumn}>
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton onClick={pushColumn}>
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
});
