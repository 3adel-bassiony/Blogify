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

    // Create new post
    public async create({ request, response, auth, i18n }: HttpContextContract) {
        const category = await Category.find(request.input('category_id'))

        if (!category)
            return response.badRequest({ error: i18n.formatMessage('common.Category_Not_Found') })

        const postSchema = schema.create({
            category_id: schema.number([rules.exists({ table: 'categories', column: 'id' })]),
            slug: schema.string({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string(),
            content: schema.string(),
            seo_description: schema.string(),
            seo_keywords: schema.string(),
            thumbnail: schema.string(),
            published_at: schema.date.optional(),
        })

        try {
            await request.validate({
                schema: postSchema,
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
                publishedAt: request.input('published_at') ?? DateTime.now(),
            })

            await post.related('category').associate(category)
            await post.related('user').associate(auth.user!)

            return post
        } catch (error) {
            return response.badRequest(error.messages)
        }
    }

    // Update existing post
    public async update({ request, response, params, auth, i18n }: HttpContextContract) {
        const post = await Post.query().where('id', params.id).first()
        if (!post) return response.status(404).send({ error: 'Post not found!' })

        if (auth.user?.id !== post.userId)
            return response.badRequest({
                error: i18n.formatMessage('comment.User_Cant_Delete_Post'),
            })

        const category = await Category.find(post.categoryId)
        if (!category)
            return response.badRequest({ error: i18n.formatMessage('common.Category_Not_Found') })

        const postSchema = schema.create({
            category_id: schema.number.optional([
                rules.exists({ table: 'categories', column: 'id' }),
            ]),
            slug: schema.string.optional({}, [rules.unique({ table: 'posts', column: 'slug' })]),
            title: schema.string.optional({}, [rules.minLength(4)]),
            content: schema.string.optional({}, [rules.minLength(4)]),
            seo_description: schema.string.optional(),
            seo_keywords: schema.string.optional(),
            thumbnail: schema.string.optional(),
            published_at: schema.date.optional(),
        })

        try {
            const payload = await request.validate({
                schema: postSchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new post',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            post.merge(payload).save()

            return post
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    // Delete existing post
    public async delete({ response, params, auth, i18n }: HttpContextContract) {
        const post = await Post.find(params.id)
        if (!post) return response.status(404).send({ error: 'Post not found!' })

        if (auth.user?.id !== post.userId)
            return response.badRequest({
                error: i18n.formatMessage('comment.User_Cant_Delete_Post'),
            })

        await post.merge({ deletedAt: DateTime.now() }).save()
        return response.status(200).send({
            message: i18n.formatMessage('common.Post_Deleted_Successfully', {
                id: params.id,
            }),
        })
    }
}
