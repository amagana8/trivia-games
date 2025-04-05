import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Paper } from '@mui/material';
import { memo, useEffect, useRef, useState } from 'react';

import * as styles from './QuestionSlot.styles';

export const QuestionSlot: React.FC<{
  children: React.ReactNode;
  categoryIndex: number;
  questionIndex: number;
}> = memo(({ children, categoryIndex, questionIndex }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return dropTargetForElements({
      element: el,
      getData: () => ({ categoryIndex, questionIndex }),
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
    });
  }, [categoryIndex, questionIndex]);

  return (
    <Paper
      variant="outlined"
      className={styles.questionSlot}
      sx={{ backgroundColor: isDraggedOver ? 'skyblue' : 'initial' }}
      ref={ref}
    >
      {children}
    </Paper>
  );
});
