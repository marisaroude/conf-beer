import * as SQLite from 'expo-sqlite'
import conferencesData from '../data/conferences.json'
import { Conference } from '../types/conference'
/*
* Expo-SQLite lets you:
*
*have a local database
*save data on the device
*without a backend
*without internet
*/


const DATABASE_NAME = 'confbeer.db'

let db: SQLite.SQLiteDatabase | null = null

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db

  db = await SQLite.openDatabaseAsync(DATABASE_NAME)
  return db
}

// Initialize the database and create tables if they don't exist
export async function initDatabase(): Promise<void> {
  const database = await getDatabase()

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS conferences (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      speaker TEXT NOT NULL,
      brewery TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      locationName TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    );
  `)

  // Keep SQLite data in sync with the source JSON on each initialization.
  await syncDatabaseWithJson()
}

// Synchronize the database with the JSON file (insert, update, and delete removed rows).
async function syncDatabaseWithJson(): Promise<void> {
  const database = await getDatabase()
  const conferenceIds: number[] = []

  await database.execAsync('BEGIN TRANSACTION')
  try {
    for (const conf of conferencesData.conferences) {
      conferenceIds.push(conf.id)

      await database.runAsync(
        `INSERT INTO conferences (id, title, speaker, brewery, description, image, startTime, endTime, locationName, latitude, longitude)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           title = excluded.title,
           speaker = excluded.speaker,
           brewery = excluded.brewery,
           description = excluded.description,
           image = excluded.image,
           startTime = excluded.startTime,
           endTime = excluded.endTime,
           locationName = excluded.locationName,
           latitude = excluded.latitude,
           longitude = excluded.longitude`,
        [
          conf.id,
          conf.title,
          conf.speaker,
          conf.brewery,
          conf.description,
          conf.image,
          conf.startTime,
          conf.endTime,
          conf.location.name,
          conf.location.latitude,
          conf.location.longitude,
        ],
      )
    }

    if (conferenceIds.length > 0) {
      const placeholders = conferenceIds.map(() => '?').join(', ')
      await database.runAsync(
        `DELETE FROM conferences WHERE id NOT IN (${placeholders})`,
        conferenceIds,
      )
    } else {
      await database.runAsync('DELETE FROM conferences')
    }

    await database.execAsync('COMMIT')
  } catch (error) {
    await database.execAsync('ROLLBACK')
    throw error
  }
}

export async function getAllConferences(): Promise<Conference[]> {
  const database = await getDatabase()
  return await database.getAllAsync<Conference>(
    'SELECT * FROM conferences ORDER BY startTime',
  )
}

export async function getConferenceById(
  id: number,
): Promise<Conference | null> {
  const database = await getDatabase()
  return await database.getFirstAsync<Conference>(
    'SELECT * FROM conferences WHERE id = ?',
    [id],
  )
}

