import { createChannel, createClient } from 'nice-grpc';

import { UserServiceClient, UserServiceDefinition } from '../../pb/user.js';

const channel = createChannel(process.env.USER_SERVICE_URL ?? 'localhost:3004');
export const userService: UserServiceClient = createClient(
  UserServiceDefinition,
  channel,
);
