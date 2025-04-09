import { CardMedia } from '@mui/material';

import { type Media, MediaType } from '../../../../../../bff/src/pb/question';
import * as styles from './QuestionMedia.styles';

export const QuestionMedia: React.FC<{ media: Media }> = ({ media: { type, url } }) => {
  switch (type) {
    case MediaType.AUDIO:
      return <CardMedia component="audio" controls src={url} className={styles.media} />;
    case MediaType.VIDEO:
      return <CardMedia component="video" controls src={url} className={styles.media} />;
    case MediaType.IMAGE:
      return <CardMedia component="img" image={url} height="50%" className={styles.media} />;
    default:
      return null;
  }
};
