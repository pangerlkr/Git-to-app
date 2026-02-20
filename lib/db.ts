import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { BuildRecord } from './types';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'data', 'builds.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS builds (
      id TEXT PRIMARY KEY,
      repoUrl TEXT NOT NULL,
      repoName TEXT NOT NULL,
      framework TEXT NOT NULL,
      platform TEXT NOT NULL,
      profile TEXT NOT NULL DEFAULT 'production',
      status TEXT NOT NULL DEFAULT 'queued',
      androidBuildId TEXT,
      iosBuildId TEXT,
      androidArtifactUrl TEXT,
      iosArtifactUrl TEXT,
      logs TEXT,
      errorMessage TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);
}

export function createBuild(build: BuildRecord): BuildRecord {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO builds (id, repoUrl, repoName, framework, platform, profile, status,
      androidBuildId, iosBuildId, androidArtifactUrl, iosArtifactUrl, logs, errorMessage, createdAt, updatedAt)
    VALUES (@id, @repoUrl, @repoName, @framework, @platform, @profile, @status,
      @androidBuildId, @iosBuildId, @androidArtifactUrl, @iosArtifactUrl, @logs, @errorMessage, @createdAt, @updatedAt)
  `);
  stmt.run({
    androidBuildId: null,
    iosBuildId: null,
    androidArtifactUrl: null,
    iosArtifactUrl: null,
    logs: null,
    errorMessage: null,
    ...build,
  });
  return build;
}

export function getBuildById(id: string): BuildRecord | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM builds WHERE id = ?').get(id) as BuildRecord | undefined;
}

export function getAllBuilds(limit = 20): BuildRecord[] {
  const db = getDb();
  return db.prepare('SELECT * FROM builds ORDER BY createdAt DESC LIMIT ?').all(limit) as BuildRecord[];
}

export function updateBuild(id: string, updates: Partial<BuildRecord>): BuildRecord | undefined {
  const db = getDb();
  updates.updatedAt = new Date().toISOString();
  const fields = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
  const stmt = db.prepare(`UPDATE builds SET ${fields} WHERE id = @id`);
  stmt.run({ ...updates, id });
  return getBuildById(id);
}

export function deleteBuild(id: string): void {
  const db = getDb();
  db.prepare('DELETE FROM builds WHERE id = ?').run(id);
}
