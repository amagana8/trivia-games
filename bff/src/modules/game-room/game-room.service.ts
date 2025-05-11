import { createChannel, createClient } from 'nice-grpc';
import {
  GameRoomServiceClient,
  GameRoomServiceDefinition,
} from '../../pb/gameRoom.js';

const channel = createChannel(
  process.env.GAME_ROOM_SERVICE_URL ?? 'localhost:3005',
);

export const gameRoomService: GameRoomServiceClient = createClient(
  GameRoomServiceDefinition,
  channel,
);
