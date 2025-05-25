import { Add, Edit } from '@mui/icons-material';
import { Button, List, ListItem } from '@mui/material';
import { useAtomState, useAtomValue } from '@zedux/react';
import { memo, Suspense, useCallback, useState } from 'react';

import { allGridGamesQueryAtom, gridGameAtom } from '../../atoms/gridGame';
import { isEditingAtom } from '../../atoms/isEditing';
import { QuestionBank } from '../../components/GridGame/QuestionBank/QuestionBank';
import { QuestionGrid } from '../../components/GridGame/QuestionGrid/QuestionGrid';
import { MenuButton } from '../../components/MenuButton/MenuButton';
import { trpc } from '../../trpc';
import * as styles from './GridGame.styles';

export const GridGame: React.FC = memo(() => {
  const [isEditing, setIsEditing] = useAtomState(isEditingAtom);
  const [showList, setShowList] = useState(false);
  const { data: allgridGames } = useAtomValue(allGridGamesQueryAtom);
  const [gridGame, setGridGame] = useAtomState(gridGameAtom);

  const handleCreateGridGame = useCallback(async () => {
    setIsEditing(true);

    const newGridGame = await trpc.gridGame.createGridGame.mutate();

    setGridGame({
      grid: newGridGame.grid,
      gridGameId: newGridGame.gridGameId,
      title: newGridGame.title,
    });
  }, []);

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
                      gridGameId: gridGame.gridGameId,
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
          onClick={() => trpc.gridGame.updateGridGame.mutate(gridGame)}
        >
          Save
        </Button>
      </div>
    </div>
  );
});
