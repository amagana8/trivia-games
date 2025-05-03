import { createChannel, createClient } from 'nice-grpc';

import {
  GridGameServiceClient,
  GridGameServiceDefinition,
} from '../../pb/gridGame.js';

const channel = createChannel(process.env.GAME_SERVICE_URL ?? 'localhost:3002');

export const gridGameService: GridGameServiceClient = createClient(
  GridGameServiceDefinition,
  channel,
);
