import { DateTime } from 'luxon'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CommentsController {
    public async index({ request }: HttpContextContract) {
        const comments = await Comment.query()
            .if(request.qs().post_id, (query) => {
                query.where('post_id', request.qs().post_id)
            })
            .if(request.qs().user_id, (query) => {
                query.where('user_id', request.qs().user_id)
            })
            .orderBy('created_at', request.qs().order_by ?? 'desc')
            .paginate(request.qs().page ?? 1, request.qs().per_page ?? 5)
        return comments
    }

    public async show({ response, params, i18n }: HttpContextContract) {
        const comment = await Comment.query()
            .where('id', params.id)
            .preload('post')
            .preload('user')
            .first()

        if (!comment)
            return response.notFound({ error: i18n.formatMessage('comment.Comment_Not_Found') })

        return comment
    }

    public async create({ request, response, auth }: HttpContextContract) {
        const commentSchema = schema.create({
            post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
            content: schema.string({}, [rules.minLength(5)]),
        })

        try {
            const payload = await request.validate({
                schema: commentSchema,
                messages: {
                    'post_id.exists': 'Post id not exist',
                    'content.minLength':
                        'The content must have minimum of {{ options.minLength }} characters',
                },
            })

            const comment = await Comment.create({
                content: payload.content,
                userId: auth.user?.id,
                postId: Number(payload.post_id),
            })

            comment.save()

            return comment
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    // Update existing category
    public async update({ request, response, params, auth, i18n }: HttpContextContract) {
        const comment = await Comment.find(params.id)

        if (!comment)
            return response.notFound({ error: i18n.formatMessage('comment.Comment_Not_Found') })

        if (auth.user?.id !== comment.userId)
            return response.badRequest({
                error: i18n.formatMessage('comment.User_Cant_Edit_Comment'),
            })

        const commentSchema = schema.create({
            post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
            content: schema.string({}, [rules.minLength(5)]),
        })

        try {
            const payload = await request.validate({
                schema: commentSchema,
                messages: {
                    'post_id.exists': 'Post id not exist',
                    'content.minLength':
                        'The content must have minimum of {{ options.minLength }} characters',
                },
            })

            comment.content = payload.content
            comment.updatedAt = DateTime.now()

            await comment.save()

            return comment
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({ response, auth, params, i18n }: HttpContextContract) {
        const comment = await Comment.find(params.id)

        if (!comment)
            return response.notFound({ error: i18n.formatMessage('comment.Comment_Not_Found') })

        if (auth.user?.id !== comment.userId)
            return response.badRequest({
                error: i18n.formatMessage('comment.User_Cant_Delete_Comment'),
            })

        await comment.delete()

        return response.status(200).send({
            message: i18n.formatMessage('comment.Comment_Deleted_Successfully', {
                id: params.id,
            }),
        })
    }
}
