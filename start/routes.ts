/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => {
    return view.render('welcome')
})

Route.group(() => {
    // Categories
    Route.group(() => {
        // GET - Categories: List all categories
        Route.get('/', 'CategoriesController.index').as('listCategories')

        // GET - Category: Get category by slug
        Route.get('/:slug', 'CategoriesController.show').as('showCategory')

        // GET - Category: Get category posts by slug
        Route.get('/:id/posts', 'CategoriesController.indexCategoryPosts').as('listCategoryPosts')

        // POST - Category: Create new category
        Route.post('/', 'CategoriesController.create').middleware('auth').as('createCategory')

        // POST - Category: Create new category
        Route.put('/:id', 'CategoriesController.update').middleware('auth').as('updateCategory')

        // DELETE Category: Delete a specific category by id
        Route.delete('/:id', 'CategoriesController.delete').middleware('auth').as('deleteCategory')
    }).prefix('/categories')

    // Posts
    Route.group(() => {
        // GET - Categories: List all categories
        Route.get('/', 'PostsController.index').as('listPosts')

        // GET - Category: Get category by slug
        Route.get('/:slug', 'PostsController.show').as('showPost')

        // POST - Category: Create new category
        Route.post('/', 'PostsController.create').middleware('auth').as('createPost')

        // POST - Category: Create new category
        Route.put('/:id', 'PostsController.update').middleware('auth').as('updatePost')

        // DELETE Category: Delete a specific category by id
        Route.delete('/:id', 'PostsController.delete').middleware('auth').as('deletepost')
    }).prefix('/posts')

    // Auth
    Route.group(() => {
        Route.post('/login', 'AuthController.login').as('login')
        Route.post('/register', 'AuthController.register').as('register')
        Route.post('/logout', 'AuthController.logout').as('logout')
        Route.post('/forgot-password', 'AuthController.forgotPassword').as('forgotPassword')
        Route.post('/reset-password/:email', 'AuthController.resetPassword').as('resetPassword')
        Route.post('/change-password', 'AuthController.changePassword').as('changePassword')
        Route.get('/verify/:email', 'AuthController.verifyEmail').as('verifyEmail')
    }).prefix('auth')
})
    .prefix('/api')
    .middleware('detectUserLocale')
