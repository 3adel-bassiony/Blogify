import { DateTime } from 'luxon'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Bookmark from 'App/Models/Bookmark'

export default class BookmarksController {
    public async index({ request, auth }: HttpContextContract) {
        const bookmarks = await Bookmark.query()
            .where('user_id', auth.user!.id)
            .preload('post')
            .orderBy('created_at', request.qs().order_by ?? 'desc')
            .paginate(request.qs().page ?? 1, request.qs().per_page ?? 5)

        return bookmarks
    }

    public async create({ request, response, auth, i18n }: HttpContextContract) {
        const postId = request.input('post_id')

        const bookmark = await Bookmark.query()
            .where('user_id', auth.user!.id)
            .andWhere('post_id', postId)
            .orderBy('id', 'desc')
            .first()

        if (bookmark)
            return response.badRequest({
                error: i18n.formatMessage('bookmark.Already_Bookmarkd_Before'),
            })

        const bookmarkSchema = schema.create({
            post_id: schema.number([rules.exists({ table: 'posts', column: 'id' })]),
        })

        try {
            await request.validate({
                schema: bookmarkSchema,
                messages: {
                    'post_id.exists': 'Post id not exist',
                },
            })

            const bookmark = await Bookmark.create({
                userId: auth.user!.id,
                postId,
            })

            await bookmark.save()
            return bookmark
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async delete({ request, response, auth, params, i18n }: HttpContextContract) {
        const postId = request.input('post_id')

        const bookmark = await Bookmark.query()
            .where('user_id', auth.user!.id)
            .andWhere('post_id', postId)
            .orderBy('id', 'desc')
            .first()

        if (!bookmark)
            return response.status(404).send({ error: i18n.formatMessage('bookmark.Not_Found') })

        if (bookmark?.userId !== auth.user!.id)
            return response.badRequest({
                error: i18n.formatMessage('bookmark.User_Cant_Unbookmark_This_Post'),
            })

        await bookmark.merge({ deletedAt: DateTime.now() }).save()
        return response.status(200).send({
            message: i18n.formatMessage('bookmark.Unbookmarkd_Post_Successfully', {
                id: params.id,
            }),
        })
    }
}
