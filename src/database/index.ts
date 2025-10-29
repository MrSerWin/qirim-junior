import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import PoemModel from './models/PoemModel';
import AuthorModel from './models/AuthorModel';
import ThemeModel from './models/ThemeModel';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true, // Enable JSI for better performance
  onSetUpError: error => {
    console.error('Database setup error:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [PoemModel, AuthorModel, ThemeModel],
});

export { PoemModel, AuthorModel, ThemeModel };
