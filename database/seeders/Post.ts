import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PostFactory from 'Database/factories/PostFactory'

export default class PostSeeder extends BaseSeeder {
    public async run() {
        await PostFactory.merge([
            { userId: 1, categoryId: 2 },
            { userId: 2, categoryId: 1 },
            { userId: 3, categoryId: 3 },
            { userId: 4, categoryId: 4 },
        ]).createMany(4)
    }
}
