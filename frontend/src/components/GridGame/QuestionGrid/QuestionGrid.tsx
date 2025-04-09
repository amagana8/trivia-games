import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { IconButton, TextField, Typography } from '@mui/material';
import { produce } from 'immer';
import { useAtom, useAtomValue } from 'jotai';
import { memo, useEffect } from 'react';

import { gridGameAtom } from '../../../atoms/gridGame';
import { isEditingAtom } from '../../../atoms/isEditing';
import { Column } from './Column/Column';
import * as styles from './QuestionGrid.styles';

export const QuestionGrid: React.FC = memo(() => {
  const [gridGame, setGridGame] = useAtom(gridGameAtom);
  const isEditing = useAtomValue(isEditingAtom);

  useEffect(() => {
    return monitorForElements({
      onDrop: ({ source, location }) => {
        const origin = location.initial.dropTargets[0];
        const destination = location.current.dropTargets[0];

        setGridGame(
          produce((draft) => {
            if (origin) {
              draft.grid[Number(origin.data.categoryIndex)].questions[Number(origin.data.questionIndex)] = '';
            }

            if (destination) {
              draft.grid[Number(destination.data.categoryIndex)].questions[Number(destination.data.questionIndex)] =
                String(source.data.questionId);
            }
          })
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
            onChange={(e) =>
              setGridGame((prevState) => ({
                ...prevState,
                title: e.target.value,
              }))
            }
            variant="standard"
            placeholder="Title"
          />
        ) : (
          <Typography variant="h3">Title</Typography>
        )}

        <div style={{ columnGap: '1rem', display: 'flex' }}>
          {gridGame.grid.map(({ category, questions }, index) => (
            <Column key={index} category={category} questions={questions} categoryIndex={index} />
          ))}
        </div>
      </div>

      {isEditing && (
        <div className={styles.gridControls}>
          <IconButton
            onClick={() =>
              setGridGame(
                produce((draft) => {
                  draft.grid.pop();
                })
              )
            }
          >
            <RemoveCircleOutlineIcon />
          </IconButton>

          <IconButton
            onClick={() =>
              setGridGame(
                produce((draft) => {
                  draft.grid.push({
                    category: '',
                    questions: ['', '', '', '', ''],
                  });
                })
              )
            }
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
});
