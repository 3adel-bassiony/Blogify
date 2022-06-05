import Comment from 'App/Models/Comment'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Comment, ({ faker }) => {
    return {
        content: faker.lorem.paragraph(),
    }
}).build()
