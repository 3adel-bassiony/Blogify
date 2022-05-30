import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from 'Database/factories/UserFactory'

export default class UserSeeder extends BaseSeeder {
    public async run() {
        await UserFactory.with('categories', 2, (category) =>
            category.with('posts', 2, (post) => post.merge([{ userId: 1 }, { userId: 1 }]))
        ).createMany(4)
    }
}
