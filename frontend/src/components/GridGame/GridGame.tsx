import { Button, List, ListItem } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { FC, Suspense, useCallback, useState } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { allGridGamesQueryAtom, gridGameAtom } from '../../atoms/gridGame';
import { isEditingAtom } from '../../atoms/isEditing';
import { trpc } from '../../trpc';
import * as styles from './GridGame.styles';
import { QuestionBank } from './QuestionBank/QuestionBank';
import { QuestionGrid } from './QuestionGrid/QuestionGrid';

export const GridGame: FC = () => {
  const setGridGame = useSetAtom(gridGameAtom);
  const [isEditing, setIsEditing] = useAtom(isEditingAtom);
  const [showList, setShowList] = useState(false);
  const allgridGames = useAtomValue(allGridGamesQueryAtom);
  const gridGameState = useAtomValue(gridGameAtom);
  const currentUser = useAtomValue(currentUserAtom);

  const handleCreateGridGame = useCallback(async () => {
    setIsEditing(true);

    if (!currentUser) {
      return;
    }

    await trpc.gridGame.createGridGame.mutate({
      authorId: currentUser.id,
      grid: [],
      title: '',
    });
  }, [currentUser?.id]);

  if (!isEditing) {
    return (
      <div>
        <Button onClick={handleCreateGridGame}>Create New Game</Button>
        <Button onClick={() => setShowList(true)}>Edit Game</Button>
        {showList && (
          <Suspense fallback={<div>Loading...</div>}>
            <List>
              {allgridGames.gridGames.map((gridGame) => (
                <ListItem
                  key={gridGame.id}
                  onClick={() => {
                    setIsEditing(true);
                    setGridGame({
                      grid: gridGame.grid,
                      id: gridGame.id,
                      title: gridGame.title,
                    });
                  }}
                >
                  {gridGame.title}
                </ListItem>
              ))}
            </List>
          </Suspense>
        )}
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <QuestionBank />

      <QuestionGrid />

      <div className={styles.footer}>
        <Button variant="contained" onClick={() => trpc.gridGame.updateGridGame.mutate(gridGameState)}>
          Save
        </Button>
      </div>
    </div>
  );
};
