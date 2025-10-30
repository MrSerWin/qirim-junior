import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 2, // Bumped version to remove image_to_view column
  tables: [
    tableSchema({
      name: 'poems',
      columns: [
        { name: 'poem_id', type: 'number', isIndexed: true },
        { name: 'title_lat', type: 'string' },
        { name: 'title_cyr', type: 'string' },
        { name: 'poem_lat', type: 'string' },
        { name: 'poem_cyr', type: 'string' },
        { name: 'author', type: 'string', isIndexed: true },
        { name: 'theme', type: 'string', isIndexed: true },
        { name: 'image', type: 'string' },
        { name: 'updated_at', type: 'number' },
        { name: 'is_deleted', type: 'boolean' },
        { name: 'is_need_to_be_added', type: 'boolean' },
        { name: 'uniq_id', type: 'string', isIndexed: true, isOptional: false },
      ],
    }),
    tableSchema({
      name: 'authors',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'themes',
      columns: [
        { name: 'name', type: 'string', isIndexed: true },
      ],
    }),
  ],
});
