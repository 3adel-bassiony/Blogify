import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Post from 'App/Models/Post'

export default class CategoriesController {
    // List all categories
    public async index(ctx: HttpContextContract) {
        const categories = await Category.query().paginate(
            ctx.request.qs().page ?? 1,
            ctx.request.qs().per_page ?? 5
        )
        return categories
    }

    public async indexCategoryPosts(ctx: HttpContextContract) {
        const posts = await Post.query()
            .where('category_id', ctx.request.params().id)
            .preload('category')
            .paginate(ctx.request.qs().page ?? 1, ctx.request.qs().per_page ?? 5)
        return posts
    }

    // Find catgeory by slug
    public async show({ response, params, i18n }: HttpContextContract) {
        const category = await Category.findBy('slug', params.slug)
        if (category) {
            return category
        } else {
            return response.status(404).send({
                error: i18n.formatMessage('common.Category_Not_Found'),
            })
        }
    }

    // Create new category
    public async create({ request, response }: HttpContextContract) {
        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'categories', column: 'slug' })]),
            title: schema.string(),
            description: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            await request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new category',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            const category = await Category.create({
                slug: request.input('slug'),
                title: request.input('title'),
                description: request.input('description'),
                thumbnail: request.input('thumbnail'),
            })

            return category
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    // Update existing category
    public async update({ request, response, params, i18n }: HttpContextContract) {
        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'categories', column: 'slug' })]),
            title: schema.string(),
            description: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            const category = await Category.find(params.id)

            if (!category)
                return response
                    .status(404)
                    .send({ error: i18n.formatMessage('common.Category_Not_Found') })

            await request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new category',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            category.slug = request.input('slug')
            category.title = request.input('title')
            category.description = request.input('description')
            category.thumbnail = request.input('thumbnail')
            category.updatedAt = DateTime.now()

            await category.save()

            return category
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    // Delete existing category
    public async delete({ response, params, i18n }: HttpContextContract) {
        const category = await Category.find(params.id)
        if (category) {
            await category.delete()
            return response.status(200).send({
                message: i18n.formatMessage('common.Category_Deleted_Successfully', {
                    id: params.id,
                }),
            })
        } else {
            return response.status(404).send({
                error: i18n.formatMessage('common.Category_Not_Found'),
            })
        }
    }
}
