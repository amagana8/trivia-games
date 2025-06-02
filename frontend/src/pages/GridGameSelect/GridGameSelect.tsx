import { Add, Edit } from '@mui/icons-material';
import { List, ListItem } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import { useAtomValue } from '@zedux/react';
import { memo, Suspense, useCallback, useState } from 'react';

import { allGridGamesQueryAtom } from '../../atoms/gridGame';
import { MenuButton } from '../../components/MenuButton/MenuButton';
import { trpc } from '../../trpc';
import * as styles from './GridGameSelect.styles';

export const GridGameSelect: React.FC = memo(() => {
  const [showList, setShowList] = useState(false);
  const { data: gridGameMap } = useAtomValue(allGridGamesQueryAtom);
  const navgiate = useNavigate();

  const handleCreateGridGame = useCallback(async () => {
    const newGridGame = await trpc.gridGame.createGridGame.mutate();

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
            {Object.values(gridGameMap).map((gridGame) => (
              <ListItem
                key={gridGame.gridGameId}
                onClick={() => {
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
