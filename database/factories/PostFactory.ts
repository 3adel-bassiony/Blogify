import Post from 'App/Models/Post'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Post, ({ faker }) => {
    return {
        slug: faker.lorem.slug(4),
        title: faker.lorem.words(5),
        content: faker.lorem.paragraph(2),
        thumbnail: faker.image.imageUrl(1920, 1080),
        seoDescription: faker.lorem.paragraph(4),
        seoKeywords: 'keyword, test, faker',
    }
}).build()
