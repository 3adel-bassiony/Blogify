import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CategoryFactory from 'Database/factories/CategoryFactory'

export default class CategorySeeder extends BaseSeeder {
    public async run() {
        await CategoryFactory.with('posts', 3).createMany(10)
    }
}
