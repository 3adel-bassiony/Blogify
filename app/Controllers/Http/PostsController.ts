import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Post from 'App/Models/Post'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'

export default class PostsController {
    // List all posts
    public async index({ request }: HttpContextContract) {
        const posts = await Post.query()
            .if(request.qs().category_id, (query) => {
                query.where('category_id', request.qs().category_id)
            })
            .if(request.qs().user_id, (query) => {
                query.where('user_id', request.qs().user_id)
            })
            .orderBy('created_at', request.qs().order_by ?? 'desc')
            .preload('category')
            .paginate(request.qs().page ?? 1, request.qs().per_page ?? 5)
        return posts
    }

    // Find post by slug
    public async show({ response, params, i18n }: HttpContextContract) {
        const post = await Post.query()
            .where('slug', params.slug)
            .preload('category')
            .preload('user')
            .first()

        if (!post) return response.notFound({ error: i18n.formatMessage('common.Post_Not_Found') })

        return post
    }

    // Create new category
    public async create({ request, response, i18n }: HttpContextContract) {
        const category = await Category.find(request.input('category_id'))

        if (!category)
            return response.badRequest({ error: i18n.formatMessage('common.Category_Not_Found') })

        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string(),
            content: schema.string(),
            seo_description: schema.string(),
            seo_keywords: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            await request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new post',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            const post = await Post.create({
                slug: request.input('slug'),
                title: request.input('title'),
                content: request.input('content'),
                seoDescription: request.input('seo_description'),
                seoKeywords: request.input('seo_keywords'),
                thumbnail: request.input('thumbnail'),
            })

            await post.related('category').associate(category)

            return post
        } catch (error) {
            return response.badRequest(error.messages)
        }
    }

    // Update existing post
    public async update({ request, response, params, i18n }: HttpContextContract) {
        const category = await Category.find(request.input('category_id'))

        if (!category)
            return response.badRequest({ error: i18n.formatMessage('common.Category_Not_Found') })

        const postSchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string(),
            content: schema.string(),
            seo_description: schema.string(),
            seo_keywords: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            const post = await Post.find(params.id)

            if (!post) return response.status(404).send({ error: 'Post not found!' })

            await request.validate({
                schema: postSchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new post',
                    'slug.unique': 'The slug should be a unique string',
                },
            })
            post.categoryId = request.input('category_id')
            post.slug = request.input('slug')
            post.title = request.input('title')
            post.content = request.input('content')
            post.thumbnail = request.input('thumbnail')
            post.seoDescription = request.input('description')
            post.seoDescription = request.input('description')
            post.updatedAt = DateTime.now()

            await post.save()

            return post
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    // Delete existing post
    public async delete({ response, params, i18n }: HttpContextContract) {
        const post = await Post.find(params.id)

        if (!post)
            return response.status(404).send({ error: i18n.formatMessage('common.Post_Not_Found') })

        await post.merge({ deletedAt: DateTime.now() }).save()
        return response.status(200).send({
            message: i18n.formatMessage('common.Post_Deleted_Successfully', {
                id: params.id,
            }),
        })
    }
}
