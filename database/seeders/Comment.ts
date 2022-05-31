import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CommentFactory from 'Database/factories/CommentFactory'

export default class CommentSeeder extends BaseSeeder {
    public async run() {
        await CommentFactory.merge([
            { userId: 1, postId: 2 },
            { userId: 2, postId: 1 },
            { userId: 2, postId: 3 },
            { userId: 3, postId: 4 },
            { userId: 4, postId: 5 },
        ]).createMany(5)
    }
}
