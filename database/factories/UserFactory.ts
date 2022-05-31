import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'
import CategoryFactory from 'Database/factories/CategoryFactory'
import PostFactory from 'Database/factories/PostFactory'

export default Factory.define(User, ({ faker }) => {
    return {
        name: faker.name.findName(),
        username: faker.internet.userName().toLocaleLowerCase(),
        email: faker.internet.email().toLocaleLowerCase(),
        phone: faker.phone.phoneNumber(),
        password: 'user1020',
        avatar: faker.internet.avatar(),
        isVerified: true,
    }
})
    .relation('categories', () => CategoryFactory)
    .relation('posts', () => PostFactory)
    .build()
