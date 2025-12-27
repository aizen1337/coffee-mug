import { vi } from 'vitest';

vi.mock('@src/lib/kafka', () => ({
  producer: {
    connect: vi.fn(),
    send: vi.fn().mockResolvedValue(undefined),
  },
  consumer: {
    connect: vi.fn(),
    subscribe: vi.fn(),
    run: vi.fn(),
  },
}));
