import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Card, CardContent } from '@mui/material';
import { memo, Suspense, useEffect, useRef, useState } from 'react';
import * as styles from './QuestionCard.styles';
import { useAtomValue } from 'jotai';
import { questionAtom } from '../../../atoms/questions';

export const QuestionCard: React.FC<{ questionId: string }> = memo(({ questionId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const question = useAtomValue(questionAtom(questionId));

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    return draggable({
      element: el,
      getInitialData: () => ({ questionId }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, []);

  return (
    <Card ref={ref} sx={{ opacity: dragging ? 0.5 : 1 }} className={styles.card}>
      <Suspense fallback={<div>Loading...</div>}>
        <CardContent>{question.query}</CardContent>
      </Suspense>
    </Card>
  );
});
