import Database from 'better-sqlite3';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import fs from 'fs';
import path from 'path';

declare global {
  // eslint-disable-next-line no-var
  var _sqlite: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var _db: BetterSQLite3Database<typeof schema> | undefined;
}

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'cms.db');

const sqlite = globalThis._sqlite ?? new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = globalThis._db ?? drizzle(sqlite, { schema });

if (process.env.NODE_ENV !== 'production') {
  globalThis._sqlite = sqlite;
  globalThis._db = db;
}
