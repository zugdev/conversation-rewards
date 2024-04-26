// cSpell:disable
import { factory, primaryKey } from "@mswjs/data";

/**
 * Creates an object that can be used as a db to persist data within tests
 */
export const db = factory({
  users: {
    id: primaryKey(Number),
    login: String,
  },
  wallets: {
    id: primaryKey(Number),
    userId: Number,
    address: String,
  },
});
