import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CategoriesController {
    // List all categories
    public async index(ctx: HttpContextContract) {
        const categories = await Category.query().paginate(
            ctx.request.qs().page ?? 1,
            ctx.request.qs().per_page ?? 5
        )
        return categories
    }

    // Find catgeory by slug
    public async show(ctx: HttpContextContract) {
        const category = await Category.findBy('slug', ctx.params.slug)
        if (category) {
            return category
        } else {
            return ctx.response.status(404).send({ error: 'Category not found!' })
        }
    }

    // Create new category
    public async create(ctx: HttpContextContract) {
        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'categories', column: 'slug' })]),
            title: schema.string(),
            description: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            await ctx.request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new category',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            const category = await Category.create({
                slug: ctx.request.input('slug'),
                title: ctx.request.input('title'),
                description: ctx.request.input('description'),
                thumbnail: ctx.request.input('thumbnail'),
            })

            return category
        } catch (error) {
            ctx.response.badRequest(error.messages)
        }
    }

    // Update existing category
    public async update(ctx: HttpContextContract) {
        const categorySchema = schema.create({
            slug: schema.string({}, [rules.unique({ table: 'categories', column: 'slug' })]),
            title: schema.string(),
            description: schema.string(),
            thumbnail: schema.string(),
        })

        try {
            const category = await Category.find(ctx.params.id)

            if (!category) return ctx.response.status(404).send({ error: 'Category not found!' })

            await ctx.request.validate({
                schema: categorySchema,
                messages: {
                    'required': 'The {{ field }} is required to create a new category',
                    'slug.unique': 'The slug should be a unique string',
                },
            })

            category.slug = ctx.request.input('slug')
            category.title = ctx.request.input('title')
            category.description = ctx.request.input('description')
            category.thumbnail = ctx.request.input('thumbnail')
            category.updatedAt = DateTime.now()

            await category.save()

            return category
        } catch (error) {
            ctx.response.badRequest(error.messages)
        }
    }

    // Delete existing category
    public async delete(ctx: HttpContextContract) {
        const category = await Category.find(ctx.params.id)
        if (category) {
            await category.delete()
            return ctx.response.status(200).send({ message: 'Category Deleted successfully!' })
        } else {
            return ctx.response.status(404).send({ error: 'Category not found!' })
        }
    }
}
