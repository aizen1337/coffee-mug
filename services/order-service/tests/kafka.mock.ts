import { vi } from 'vitest';
import type {
  EachMessagePayload,
  KafkaMessage,
} from 'kafkajs';

type EachMessageHandler =
  (payload: EachMessagePayload) => Promise<void>;

let handler: EachMessageHandler | null = null;

export const producer = {
  connect: vi.fn().mockResolvedValue(undefined),
  send: vi.fn().mockResolvedValue(undefined),
};

export const consumer = {
  connect: vi.fn().mockResolvedValue(undefined),
  subscribe: vi.fn().mockResolvedValue(undefined),

  run: vi.fn().mockImplementation(
    (args: unknown) => {
      const config = args as {
        eachMessage: EachMessageHandler;
      };

      handler = config.eachMessage;
    },
  ),

  /** Test helper */
  __emit: async (value: unknown) => {
    if (!handler) {
      throw new Error('Consumer not started');
    }

    const message: KafkaMessage = {
      key: null,
      value: Buffer.from(JSON.stringify(value)),
      headers: {},
      offset: '0',
      timestamp: Date.now().toString(),
      attributes: 0,
    };

    await handler({
      topic: 'test',
      partition: 0,
      message,
      heartbeat: () => Promise.resolve(),
      pause: () => () => { /* empty */ },
    });
  },
};
