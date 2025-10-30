import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';
import { API_CONFIG } from '../../config/api';

export default class PoemModel extends Model {
  static table = 'poems';

  // @ts-expect-error
  @field('poem_id') poemId!: number;
  // @ts-expect-error
  @field('title_lat') titleLat!: string;
  // @ts-expect-error
  @field('title_cyr') titleCyr!: string;
  // @ts-expect-error
  @field('poem_lat') poemLat!: string;
  // @ts-expect-error
  @field('poem_cyr') poemCyr!: string;
  // @ts-expect-error
  @field('author') author!: string;
  // @ts-expect-error
  @field('theme') theme!: string;
  // @ts-expect-error
  @field('image') image!: string;
  // @ts-expect-error
  @date('updated_at') updatedAt!: Date;
  // @ts-expect-error
  @field('is_deleted') isDeleted!: boolean;
  // @ts-expect-error
  @field('is_need_to_be_added') isNeedToBeAdded!: boolean;
  // @ts-expect-error
  @field('uniq_id') uniqId!: string;

  /**
   * Computed property for image URL
   * Based on original C# logic:
   * - Return empty string if image is null/empty
   * - Return image as-is if it starts with "http" (full URL)
   * - Otherwise prepend server URL with /uploads/ path
   */
  get imageToView(): string {
    if (!this.image || this.image.trim() === '') {
      return '';
    }

    if (this.image.startsWith('http')) {
      return this.image;
    }

    return `${API_CONFIG.BASE_URL}/uploads/${this.image}`;
  }
}
