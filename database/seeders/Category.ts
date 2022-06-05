import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CategoryFactory from 'Database/factories/CategoryFactory'

export default class CategorySeeder extends BaseSeeder {
    public async run() {
        await CategoryFactory.merge([{ userId: 1 }, { userId: 2 }]).createMany(2)
    }
}
