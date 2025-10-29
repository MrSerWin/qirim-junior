
import { Q } from '@nozbe/watermelondb';
import { AuthorModel, database, PoemModel, ThemeModel } from '../database';
import { Poem } from '../types';


class PoemService {
  /**
   * Get all poems with optional filtering
   */
  async getPoems(filters?: {
    author?: string;
    theme?: string;
    searchQuery?: string;
  }) {
    const poemsCollection = database.collections.get<PoemModel>('poems');

    let query = poemsCollection.query(
      Q.where('is_deleted', false),
      Q.sortBy('poem_id', Q.asc)
    );

    if (filters?.author) {
      query = poemsCollection.query(
        Q.where('is_deleted', false),
        Q.where('author', filters.author),
        Q.sortBy('poem_id', Q.asc)
      );
    }

    if (filters?.theme) {
      query = poemsCollection.query(
        Q.where('is_deleted', false),
        Q.where('theme', Q.like(`%${filters.theme}%`)),
        Q.sortBy('poem_id', Q.asc)
      );
    }

    return await query.fetch();
  }

  /**
   * Get a single poem by ID
   */
  async getPoemById(id: number): Promise<PoemModel | null> {
    const poemsCollection = database.collections.get<PoemModel>('poems');
    const poems = await poemsCollection.query(Q.where('poem_id', id)).fetch();
    return poems[0] || null;
  }

  /**
   * Get all unique authors
   */
  async getAuthors(): Promise<AuthorModel[]> {
    const authorsCollection = database.collections.get<AuthorModel>('authors');
    return await authorsCollection.query().fetch();
  }

  /**
   * Get all unique themes
   */
  async getThemes(): Promise<ThemeModel[]> {
    const themesCollection = database.collections.get<ThemeModel>('themes');
    return await themesCollection.query().fetch();
  }

  /**
   * Import poems from JSON data
   */
  async importPoems(poemsData: Poem[]) {
    await database.write(async () => {
      const poemsCollection = database.collections.get<PoemModel>('poems');
      const authorsCollection = database.collections.get<AuthorModel>('authors');
      const themesCollection = database.collections.get<ThemeModel>('themes');

      // Track unique authors and themes
      const uniqueAuthors = new Set<string>();
      const uniqueThemes = new Set<string>();

      // Import poems
      for (const poemData of poemsData) {
        // Check if poem already exists by uniqId
        const existing = await poemsCollection
          .query(Q.where('uniq_id', poemData.UniqId))
          .fetch();

        if (existing.length === 0) {
          await poemsCollection.create(poem => {
            poem.poemId = poemData.id;
            poem.titleLat = poemData.TitleLat;
            poem.titleCyr = poemData.TitleCyr;
            poem.poemLat = poemData.PoemLat;
            poem.poemCyr = poemData.PoemCyr;
            poem.author = poemData.Author;
            poem.theme = poemData.Theme;
            poem.image = poemData.Image;
            poem.imageToView = poemData.ImageToView;
            poem.updatedAt = new Date(poemData.UpdatedAt);
            poem.isDeleted = poemData.IsDeleted;
            poem.isNeedToBeAdded = poemData.IsNeedToBeAdded;
            poem.uniqId = poemData.UniqId;
          });
        }

        uniqueAuthors.add(poemData.Author);
        uniqueThemes.add(poemData.Theme);
      }

      // Import unique authors
      for (const authorName of uniqueAuthors) {
        const existingAuthor = await authorsCollection
          .query(Q.where('name', authorName))
          .fetch();

        if (existingAuthor.length === 0) {
          await authorsCollection.create(author => {
            author.name = authorName;
          });
        }
      }

      // Import unique themes
      for (const themeName of uniqueThemes) {
        const existingTheme = await themesCollection
          .query(Q.where('name', themeName))
          .fetch();

        if (existingTheme.length === 0) {
          await themesCollection.create(theme => {
            theme.name = themeName;
          });
        }
      }
    });
  }

  /**
   * Check if database is empty
   */
  async isDatabaseEmpty(): Promise<boolean> {
    const poemsCollection = database.collections.get<PoemModel>('poems');
    const count = await poemsCollection.query().fetchCount();
    return count === 0;
  }

  /**
   * Clear all data (for testing purposes)
   */
  async clearAllData() {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  }
}

export default new PoemService();
