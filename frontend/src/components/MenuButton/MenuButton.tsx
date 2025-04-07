import { Card, CardActionArea, CardMedia, Typography } from '@mui/material';
import { clsx } from 'clsx';
import React, { memo } from 'react';

import * as styles from './MenuButton.styles';

export const MenuButton: React.FC<{ label: string; onClick: () => void; icon: React.ReactNode; className?: string }> =
  memo(({ label, onClick, icon, className }) => (
    <Card className={clsx(styles.card, className)}>
      <CardActionArea className={styles.actionArea} onClick={onClick}>
        <CardMedia className={styles.cardMedia}>{icon}</CardMedia>
        <Typography align="center">{label}</Typography>
      </CardActionArea>
    </Card>
  ));
