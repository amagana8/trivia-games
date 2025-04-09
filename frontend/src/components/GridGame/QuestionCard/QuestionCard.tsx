import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Card, CardContent } from '@mui/material';
import { useAtomValue } from 'jotai';
import { memo, Suspense, useEffect, useRef, useState } from 'react';

import { questionAtom } from '../../../atoms/questions';
import * as styles from './QuestionCard.styles';
import { QuestionMedia } from './QuestionMedia/QuestionMedia';

export const QuestionCard: React.FC<{ questionId: string }> = memo(({ questionId }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const question = useAtomValue(questionAtom(questionId));
  const [flipped, setFlipped] = useState(false);

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
  }, [questionId]);

  return (
    <>
      <Card
        ref={ref}
        sx={[{ opacity: dragging ? 0.5 : 1 }, flipped && { transform: 'rotateY(180deg)' }]}
        className={styles.card}
        onClick={() => setFlipped((prev) => !prev)}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {question.embed && <QuestionMedia media={question.embed} />}

          <CardContent>{question.query}</CardContent>

          <CardContent className={styles.back}>{question.answer}</CardContent>
        </Suspense>
      </Card>
    </>
  );
});
