import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Like from 'App/Models/Like'

export default class LikesController {
    public async index({ request, auth }: HttpContextContract) {
        const likes = await Like.query()
            .where('user_id', auth.user!.id)
            .preload('post')
            .orderBy('created_at', request.qs().order_by ?? 'desc')
            .paginate(request.qs().page ?? 1, request.qs().per_page ?? 5)

        return likes
    }

    public async create({ request, response, auth, i18n }: HttpContextContract) {
        const postId = request.input('post_id')

        const like = await Like.query()
            .where('user_id', auth.user!.id)
            .andWhere('post_id', postId)
            .orderBy('id', 'desc')
            .first()

        if (like)
            return response.badRequest({
                error: i18n.formatMessage('like.Already_Liked_Before'),
            })

        const likeSchema = schema.create({
            post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
        })

        try {
            await request.validate({
                schema: likeSchema,
                messages: {
                    'post_id.exists': 'Post id not exist',
                },
            })

            const like = await Like.create({
                userId: auth.user!.id,
                postId,
            })

            await like.save()
            return like
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({ request, response, auth, params, i18n }: HttpContextContract) {
        const postId = request.input('post_id')

        const like = await Like.query()
            .where('user_id', auth.user!.id)
            .andWhere('post_id', postId)
            .orderBy('id', 'desc')
            .first()

        if (!like)
            return response.status(404).send({ error: i18n.formatMessage('like.Like_Not_Found') })

        if (like?.userId !== auth.user!.id)
            return response.badRequest({
                error: i18n.formatMessage('like.User_Cant_Unlike_This_Post'),
            })

        await like.merge({ deletedAt: DateTime.now() }).save()
        return response.status(200).send({
            message: i18n.formatMessage('like.Unliked_Post_Successfully', {
                id: params.id,
            }),
        })
    }
}
