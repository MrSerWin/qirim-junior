import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class ThemeModel extends Model {
  static table = 'themes';

  // @ts-expect-error
  @field('name') name!: string;
}
