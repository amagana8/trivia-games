import { Person, Star } from '@mui/icons-material';
import { Card, CardMedia, Typography } from '@mui/material';
import React, { memo } from 'react';

import * as styles from './PlayerCard.styles';

export const PlayerCard: React.FC<{ playerId: string; isHost?: boolean }> =
  memo(({ playerId, isHost }) => {
    return (
      <div>
        <Card className={styles.card}>
          <CardMedia>
            <Person />
          </CardMedia>

          <Typography align="center">{playerId}</Typography>

          {isHost && <Star />}
        </Card>
      </div>
    );
  });
