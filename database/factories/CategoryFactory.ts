import Category from 'App/Models/Category'
import Factory from '@ioc:Adonis/Lucid/Factory'
import PostFactory from 'Database/factories/PostFactory'

export default Factory.define(Category, ({ faker }) => {
    return {
        slug: faker.internet.domainWord(),
        title: faker.lorem.words(5),
        description: faker.lorem.paragraph(4),
        thumbnail: faker.image.imageUrl(1920, 1080),
    }
})
    .relation('posts', () => PostFactory)
    .build()
