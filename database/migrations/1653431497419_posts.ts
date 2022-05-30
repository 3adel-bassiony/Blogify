import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'posts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('slug')
            table.string('title')
            table.text('content', 'longtext')
            table.string('thumbnail')
            table.text('seo_description')
            table.string('seo_keywords')
            table.integer('category_id').unsigned().references('categories.id').onDelete('CASCADE')
            table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
