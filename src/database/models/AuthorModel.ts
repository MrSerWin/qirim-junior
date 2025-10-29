import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class AuthorModel extends Model {
  static table = 'authors';

  // @ts-expect-error
  @field('name') name!: string;
}
