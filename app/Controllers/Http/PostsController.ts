import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class PostsController {
    // List all posts
    public async index(ctx: HttpContextContract) {
        const posts = await Post.query()
            .preload('category')
            .paginate(ctx.request.qs().page ?? 1, ctx.request.qs().per_page ?? 5)
        return posts
    }

    // Find post by slug
    public async show({ params, response }: HttpContextContract) {
        const post = await Post.query().where('slug', params.slug).preload('category').first
        if (post) {
            return post
        } else {
            return response.status(404).send({ error: 'Post not found!' })
        }
    }

    // Create new category
    public async create(ctx: HttpContextContract) {
        const category = await Category.find(ctx.request.input('category_id'))

        if (!category) return ctx.response.badRequest({ error: 'category_id not found!' })

        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string(),
            content: schema.string(),
            seo_description: schema.string(),
            seo_keywords: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            await ctx.request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new post',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            const post = await Post.create({
                slug: ctx.request.input('slug'),
                title: ctx.request.input('title'),
                content: ctx.request.input('content'),
                seoDescription: ctx.request.input('seo_description'),
                seoKeywords: ctx.request.input('seo_keywords'),
                thumbnail: ctx.request.input('thumbnail'),
            })

            await post.related('category').associate(category)

            return post
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }

    // Update existing post
    public async update(ctx: HttpContextContract) {
        const category = await Category.find(ctx.request.input('category_id'))

        if (!category) return ctx.response.badRequest({ error: 'category_id not found!' })

        const postSchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string(),
            content: schema.string(),
            seo_description: schema.string(),
            seo_keywords: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            const post = await Post.find(ctx.params.id)

            if (!post) return ctx.response.status(404).send({ error: 'Post not found!' })

            await ctx.request.validate({
                schema: postSchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new post',
                    'slug.unique': 'The slug should be a unique string',
                },
            })
            post.categoryId = ctx.request.input('category_id')
            post.slug = ctx.request.input('slug')
            post.title = ctx.request.input('title')
            post.content = ctx.request.input('content')
            post.thumbnail = ctx.request.input('thumbnail')
            post.seoDescription = ctx.request.input('description')
            post.seoDescription = ctx.request.input('description')
            post.updatedAt = DateTime.now()

            await post.save()

            return post
        } catch (error) {
            ctx.response.badRequest(error.messages)
        }
    }

    // Delete existing post
    public async delete(ctx: HttpContextContract) {
        const post = await Post.find(ctx.params.id)
        if (post) {
            await post.delete()
            return ctx.response.status(200).send({ message: 'Post Deleted successfully!' })
        } else {
            return ctx.response.status(404).send({ error: 'Post not found!' })
        }
    }
}
