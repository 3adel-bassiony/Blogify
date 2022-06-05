import { test } from '@japa/runner'

test.group('Categories list', () => {
    test('Get a paginated list of existing categories', async ({ client }) => {
        const response = await client.get('/api/categories')
        response.hasBody()
    })

    test('Categories list length > 0', async ({ client }) => {
        const response = await client.get('/api/categories')
        response.body().data.length > 0
    })
})
