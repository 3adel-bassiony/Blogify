import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
    return {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        password: 'admin1020',
        avatar: faker.internet.avatar(),
        isVerified: false,
    }
}).build()
