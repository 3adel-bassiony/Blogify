import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User'
import ApiToken from 'App/Models/ApiToken'
import { DateTime } from 'luxon'

export default class AuthController {
    public async login({ auth, request, response, i18n }: HttpContextContract) {
        const email = request.input('email')
        const password = request.input('password')

        const user = await User.query().where('email', email).firstOrFail()

        try {
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '7days',
                name: 'Access Token',
            })
            return {
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                avatar: user.avatar,
                is_verified: user.isVerified,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
                token: token.tokenHash,
            }
        } catch {
            return response.badRequest({ error: i18n.formatMessage('auth.Invalid_Credentials') })
        }
    }

    public async register({ request, response, auth }: HttpContextContract) {
        const name = request.input('name')
        const username = request.input('username')
        const email = request.input('email')
        const phone = request.input('phone')
        const password = request.input('password')
        const avatar = request.input('avatar')

        const userSchema = schema.create({
            name: schema.string(),
            username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
            email: schema.string({}, [rules.unique({ table: 'users', column: 'email' })]),
            phone: schema.string({}, [rules.unique({ table: 'users', column: 'phone' })]),
            password: schema.string(),
        })

        try {
            await request.validate({
                schema: userSchema,
                messages: {
                    'required': 'The {{ field }} is required to register new user',
                    'username.unique': 'This {{ field }} is exist',
                    'email.unique': 'This {{ field}} is exist',
                    'phone.unique': 'This {{ field}} is exist',
                },
            })

            const user = await User.create({
                name,
                username,
                email,
                phone,
                password,
                avatar,
            })

            const token = await auth.use('api').generate(user, {
                expiresIn: '7days',
                name: 'Access Token',
            })

            const verificationToken = await auth.use('api').generate(user, {
                expiresIn: '60m',
                name: 'Email Verification',
            })

            await Mail.sendLater((message) => {
                message
                    .from('info@example.com')
                    .to(email)
                    .subject('Verify Your Email')
                    .htmlView('emails/welcome', {
                        url: `${process.env.APP_URL}/api/auth/verify/${verificationToken.tokenHash}`,
                    })
            })

            // Return user object
            return {
                name,
                username,
                email,
                phone,
                avatar,
                is_verified: false,
                created_at: user.createdAt,
                updated_at: user.updatedAt,
                token: token.tokenHash,
            }
        } catch (error) {
            response.badRequest(error.messages)
        }
    }

    public async logout({ auth }: HttpContextContract) {
        await auth.use('api').revoke()
        return {
            revoked: true,
        }
    }

    public async forgotPassword({ request, response, auth, i18n }: HttpContextContract) {
        const email = request.input('email')

        const user = await User.query().where('email', email).firstOrFail()

        if (!user) return response.badRequest({ error: i18n.formatMessage('auth.Email_Not_Exist') })

        const token = await auth.use('api').generate(user, {
            expiresIn: '30m',
        })

        await Mail.sendLater((message) => {
            message
                .from('info@example.com')
                .to(email)
                .subject('Reset Password')
                .htmlView('emails/reset_password', {
                    url: `${process.env.APP_URL}api/auth/reset-password/${token.tokenHash}`,
                })
        })

        return response.status(200).send({
            message: i18n.formatMessage('auth.Reset_Password_Email_Sent_Successfully'),
        })
    }

    public async resetPassword({ request, response, params, i18n }: HttpContextContract) {
        const token = await ApiToken.query()
            .where('token', params.token)
            .where('expires_at', '>', DateTime.local().toSQL())
            .first()

        if (!token) return response.notFound({ error: i18n.formatMessage('auth.Invalid_Token') })

        const user = await User.find(token.userId)

        if (!user) return response.notFound({ error: i18n.formatMessage('auth.Email_Not_Exist') })

        user.password = request.input('new_password')
        user.save()
        token.delete()

        return response
            .status(200)
            .send({ message: i18n.formatMessage('auth.Password_Changed_Successfully') })
    }

    public async changePassword({ request, response, i18n }: HttpContextContract) {
        const email = request.input('email')
        const currentPassword = request.input('current_password')
        const newPassword = request.input('new_password')
        const user = await User.query().where('email', email).firstOrFail()
        const isCurrentPasswordCorrect = await Hash.verify(user.password, currentPassword)

        try {
            if (isCurrentPasswordCorrect) {
                user.password = newPassword
                user.save()
                return response
                    .status(200)
                    .send({ message: i18n.formatMessage('auth.Password_Changed_Successfully') })
            } else {
                return response.badRequest({
                    error: i18n.formatMessage('auth.Current_Password_Wrong'),
                })
            }
        } catch (error) {
            return response.badRequest({ error: i18n.formatMessage('auth.Email_Not_Exist') })
        }
    }

    public async verifyEmail({ response, params, i18n }) {
        const token = await ApiToken.query()
            .where('token', params.token)
            .where('expires_at', '>', DateTime.local().toSQL())
            .first()

        if (!token) return response.notFound({ error: i18n.formatMessage('auth.Invalid_Token') })

        const user = await User.find(token.userId)

        if (!user) return response.notFound({ error: i18n.formatMessage('auth.Email_Not_Exist') })

        user.isVerified = true
        user.save()
        token.delete()

        return response.status(200).send({ message: i18n.formatMessage('auth.Email_Verified') })
    }

    public async refreshToken({ request, response, auth, i18n }: HttpContextContract) {
        const token = await ApiToken.query().where('token', request.input('token')).first()

        if (!token) return response.notFound({ error: i18n.formatMessage('auth.Invalid_Token') })

        const user = await User.find(token.userId)

        if (!user) return response.notFound({ error: i18n.formatMessage('auth.Email_Not_Exist') })

        const newToken = await auth.use('api').generate(user, {
            expiresIn: '7days',
            name: 'Access Token',
        })

        token.delete()

        return response.status(200).send({ token: newToken.tokenHash })
    }
}
