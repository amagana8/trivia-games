import { Add, Edit } from '@mui/icons-material';
import { List, ListItem } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAtomInstance, useAtomValue } from '@zedux/react';
import { memo, Suspense, useCallback, useState } from 'react';

import { allGridGamesQueryAtom, gridGameAtom } from '../../atoms/gridGame';
import { MenuButton } from '../../components/MenuButton/MenuButton';
import { trpc } from '../../trpc';
import * as styles from './GridGameSelect.styles';

export const GridGameSelect: React.FC = memo(() => {
  const { set: setGridGame } = useAtomInstance(gridGameAtom);
  const [showList, setShowList] = useState(false);
  const { data: allgridGames } = useAtomValue(allGridGamesQueryAtom);
  const navgiate = useNavigate();

  const handleCreateGridGame = useCallback(async () => {
    const newGridGame = await trpc.gridGame.createGridGame.mutate();

    setGridGame({
      grid: newGridGame.grid,
      gridGameId: newGridGame.gridGameId,
      title: newGridGame.title,
    });

    navgiate({
      params: { gridGameId: newGridGame.gridGameId },
      to: '/grid-game/$gridGameId',
    });
  }, []);

  const handleShowGameList = useCallback(() => {
    setShowList(true);
  }, []);

  return (
    <div className={styles.root}>
      <MenuButton onClick={handleCreateGridGame} label="New" icon={<Add />} />
      <MenuButton onClick={handleShowGameList} label="Edit" icon={<Edit />} />
      {showList && (
        <Suspense fallback={<div>Loading...</div>}>
          <List>
            {allgridGames?.gridGames.map((gridGame) => (
              <ListItem
                key={gridGame.gridGameId}
                onClick={() => {
                  setGridGame({
                    grid: gridGame.grid,
                    gridGameId: gridGame.gridGameId,
                    title: gridGame.title,
                  });

                  navgiate({
                    params: { gridGameId: gridGame.gridGameId },
                    to: '/grid-game/$gridGameId',
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
});
