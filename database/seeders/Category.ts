import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CategoryFactory from 'Database/factories/CategoryFactory'

export default class CategorySeeder extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await CategoryFactory.createMany(5)
    }
}
