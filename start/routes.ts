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

        // POST - Category: Create new category
        Route.post('/', 'CategoriesController.create').middleware('auth').as('createCategory')

        // POST - Category: Create new category
        Route.put('/:id', 'CategoriesController.update').middleware('auth').as('updateCategory')

        // DELETE Category: Delete a specific category by id
        Route.delete('/:id', 'CategoriesController.delete').middleware('auth').as('deleteCategory')
    }).prefix('/categories')

    // Posts
    Route.group(() => {
        // GET - List all posts
        Route.get('/', 'PostsController.index').as('listPosts')

        // GET - Get Post by slug
        Route.get('/:slug', 'PostsController.show').as('showPost')

        // POST - Create new post
        Route.post('/', 'PostsController.create').middleware('auth').as('createPost')

        // Put - Update existing post
        Route.put('/:id', 'PostsController.update').middleware('auth').as('updatePost')

        // DELETE - Delete a specific post
        Route.delete('/:id', 'PostsController.delete').middleware('auth').as('deletepost')
    }).prefix('/posts')

    // Comments
    Route.group(() => {
        // GET - List all comments
        Route.get('/', 'CommentsController.index').as('listComments')

        // GET - Get Comment by id
        Route.get('/:id', 'CommentsController.show').as('showComment')

        // POST - Create new comment
        Route.post('/', 'CommentsController.create').middleware('auth').as('createComment')

        // Put - Update existing comment
        Route.put('/:id', 'CommentsController.update').middleware('auth').as('updateComment')

        // DELETE - Delete a specific comment
        Route.delete('/:id', 'CommentsController.delete').middleware('auth').as('deleteComment')
    }).prefix('/comments')

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

    /// Profile
    Route.group(() => {
        Route.get('/', 'ProfilesController.show')
        Route.put('/', 'ProfilesController.edit')
        Route.patch('/', 'ProfilesController.update')
        Route.delete('/', 'ProfilesController.delete')
    })
        .prefix('profile')
        .middleware('auth')

    /// Likes
    Route.group(() => {
        Route.get('/', 'LikesController.index')
        Route.post('/', 'LikesController.create')
        Route.delete('/', 'LikesController.delete')
    })
        .prefix('likes')
        .middleware('auth')

    /// Bookmarks
    Route.group(() => {
        Route.get('/', 'BookmarksController.index')
        Route.post('/', 'BookmarksController.create')
        Route.delete('/', 'BookmarksController.delete')
    })
        .prefix('bookmarks')
        .middleware('auth')
})
    .prefix('/api')
    .middleware('detectUserLocale')
