import Add from '@mui/icons-material/Add';
import { Button, Typography } from '@mui/material';
import { useAtomValue } from '@zedux/react';
import { memo, Suspense, useCallback, useState } from 'react';

import { availableQuestionsAtom } from '../../../atoms/questions';
import { QuestionCard } from '../QuestionCard/QuestionCard';
import * as styles from './QuestionBank.styles';
import { QuestionDialog } from './QuestionDialog/QuestionDialog';

export const QuestionBank: React.FC<{ gridGameId: string }> = memo(
  ({ gridGameId }) => {
    const availableQuestions = useAtomValue(availableQuestionsAtom, [
      gridGameId,
    ]);
    const [isOpen, setIsOpen] = useState(false);

    const closeDialog = useCallback(() => setIsOpen(false), []);

    return (
      <aside className={styles.sidebar}>
        <Typography variant="h4">Questions</Typography>

        <div className={styles.list}>
          <Suspense fallback={<div>Loading...</div>}>
            {availableQuestions.map((questionId) => (
              <QuestionCard questionId={questionId} key={questionId} />
            ))}
          </Suspense>
        </div>

        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={() => setIsOpen(true)}
        >
          Question
        </Button>

        {isOpen && <QuestionDialog onClose={closeDialog} />}
      </aside>
    );
  },
);
