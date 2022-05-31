import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
    public async handle({ response, auth, i18n }: HttpContextContract, next: () => Promise<void>) {
        await auth.use('api').check()

        if (!auth.use('api').isLoggedIn) {
            response.unauthorized({ error: i18n.formatMessage('auth.Unauthorized_Error_Message') })
            return
        }

        await next()
    }
}
