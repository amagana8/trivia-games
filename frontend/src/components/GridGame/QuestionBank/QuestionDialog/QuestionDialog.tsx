import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import React, { memo, useCallback, useState } from 'react';

import { MediaType } from '../../../../../../bff/src/pb/question';
import { currentUserAtom } from '../../../../atoms/currentUser';
import { trpc } from '../../../../trpc';
import * as styles from './QuestionDialog.styles';

export const QuestionDialog: React.FC<{ onClose: () => void }> = memo(({ onClose }) => {
  const [mediaType, setMediaType] = useState<MediaType>(MediaType.UNDEFINED);
  const currentUser = useAtomValue(currentUserAtom);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!currentUser) {
        return;
      }

      const formData = new FormData(e.currentTarget);
      await trpc.question.createQuestion.mutate({
        answer: String(formData.get('answer')),
        authorId: currentUser.id,
        embed: {
          type: mediaType,
          url: String(formData.get('embedLink')),
        },
        query: String(formData.get('query')),
      });

      onClose();
    },
    [currentUser, mediaType, onClose]
  );

  return (
    <Dialog
      open
      fullWidth
      onClose={onClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle>New Question</DialogTitle>

      <DialogContent className={styles.dialogForm}>
        <TextField placeholder="Question" name="query" />

        <TextField placeholder="Answer" name="answer" />

        <FormLabel>Embed</FormLabel>

        <FormGroup row>
          <FormControl>
            <InputLabel>Media Type</InputLabel>

            <Select
              value={mediaType}
              label="Media Type"
              sx={{ width: '10em' }}
              onChange={(e) => setMediaType(e.target.value as MediaType)}
            >
              <MenuItem value={MediaType.IMAGE}>Image</MenuItem>

              <MenuItem value={MediaType.VIDEO}>Video</MenuItem>

              <MenuItem value={MediaType.AUDIO}>Audio</MenuItem>
            </Select>
          </FormControl>

          <TextField placeholder="Embed Link" name="embedLink" className={styles.embedLinkInput} />
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>

        <Button type="submit" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
});
