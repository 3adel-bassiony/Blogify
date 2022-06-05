import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'

export default class ProfilesController {
    public async show({ auth }: HttpContextContract) {
        return auth.user?.toJSON()
    }

    public async edit({ request, response, auth }: HttpContextContract) {
        const userSchema = schema.create({
            name: schema.string({}, [rules.minLength(8)]),
            username: schema.string({}, [
                rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
            ]),
            email: schema.string({}, [
                rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
            ]),
            phone: schema.string({}, [rules.unique({ table: 'users', column: 'phone' })]),
        })

        try {
            const payload = await request.validate({
                schema: userSchema,
                messages: {
                    'required': 'The {{ field }} is required to register new user',
                    'username.unique': 'This {{ field }} is exist',
                    'email.unique': 'This {{ field}} is exist',
                    'phone.unique': 'This {{ field}} is exist',
                },
            })

            const user = await auth.user?.merge(payload).save()

            return user
        } catch (error) {
            response.status(422).send(error.messages)
        }
    }

    public async update({ request, response, auth }: HttpContextContract) {
        const userSchema = schema.create({
            name: schema.string.optional({}, [rules.minLength(8)]),
            username: schema.string.optional({}, [
                rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
            ]),
            email: schema.string.optional({}, [
                rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
            ]),
            phone: schema.string.optional({}, [rules.unique({ table: 'users', column: 'phone' })]),
        })

        try {
            const payload = await request.validate({
                schema: userSchema,
                messages: {
                    'username.unique': 'This {{ field }} is exist',
                    'email.unique': 'This {{ field}} is exist',
                    'phone.unique': 'This {{ field}} is exist',
                },
            })

            const user = await auth.user?.merge(payload).save()

            return user
        } catch (error) {
            response.status(422).send(error.messages)
        }
    }

    public async delete({ response, auth, i18n }: HttpContextContract) {
        await auth.user?.merge({ deletedAt: DateTime.now() }).save()
        await auth.use('api').revoke()
        return response.send({ message: i18n.formatMessage('profile.Deleted_Successfully') })
    }
}
