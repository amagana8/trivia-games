import { Button } from '@mui/material';
import { useAtomValue } from '@zedux/react';
import { memo } from 'react';

import { gridGameAtom } from '../../atoms/gridGame';
import { QuestionBank } from '../../components/GridGame/QuestionBank/QuestionBank';
import { QuestionGrid } from '../../components/GridGame/QuestionGrid/QuestionGrid';
import { trpc } from '../../trpc';
import * as styles from './GridGameEditor.styles';

export const GridGameEditor: React.FC = memo(() => {
  const gridGame = useAtomValue(gridGameAtom);

  return (
    <div className={styles.root}>
      <QuestionBank />

      <QuestionGrid isEditing />

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
