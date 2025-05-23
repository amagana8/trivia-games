import { Add, Edit } from '@mui/icons-material';
import { Button, List, ListItem } from '@mui/material';
import { useAtomInstance, useAtomState, useAtomValue } from '@zedux/react';
import { Suspense, useCallback, useState } from 'react';

import { currentUserAtom } from '../../atoms/currentUser';
import { allGridGamesQueryAtom, gridGameAtom } from '../../atoms/gridGame';
import { isEditingAtom } from '../../atoms/isEditing';
import { QuestionBank } from '../../components/GridGame/QuestionBank/QuestionBank';
import { QuestionGrid } from '../../components/GridGame/QuestionGrid/QuestionGrid';
import { MenuButton } from '../../components/MenuButton/MenuButton';
import { trpc } from '../../trpc';
import * as styles from './GridGame.styles';

export const GridGame: React.FC = () => {
  const { set: setGridGame } = useAtomInstance(gridGameAtom);
  const [isEditing, setIsEditing] = useAtomState(isEditingAtom);
  const [showList, setShowList] = useState(false);
  const { data: allgridGames } = useAtomValue(allGridGamesQueryAtom);
  const gridGameState = useAtomValue(gridGameAtom);
  const { data: currentUser } = useAtomValue(currentUserAtom);

  const handleCreateGridGame = useCallback(async () => {
    setIsEditing(true);

    if (!currentUser) {
      return;
    }

    await trpc.gridGame.createGridGame.mutate({
      grid: [],
      title: '',
    });
  }, [currentUser?.userId]);

  const handleShowGameList = useCallback(() => {
    setShowList(true);
  }, []);

  if (!isEditing) {
    return (
      <div className={styles.gridGameSelect}>
        <MenuButton onClick={handleCreateGridGame} label="New" icon={<Add />} />
        <MenuButton onClick={handleShowGameList} label="Edit" icon={<Edit />} />
        {showList && (
          <Suspense fallback={<div>Loading...</div>}>
            <List>
              {allgridGames?.gridGames.map((gridGame) => (
                <ListItem
                  key={gridGame.gridGameId}
                  onClick={() => {
                    setIsEditing(true);
                    setGridGame({
                      grid: gridGame.grid,
                      id: gridGame.gridGameId,
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
        <Button
          variant="contained"
          onClick={() => trpc.gridGame.updateGridGame.mutate(gridGameState)}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
