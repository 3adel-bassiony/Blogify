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
        Route.get('/:slug', 'CategoriesController.show').as('sh0wCategory')

        // POST - Category: Create new category
        Route.post('/', 'CategoriesController.create').as('createCategory')

        // POST - Category: Create new category
        Route.put('/:id', 'CategoriesController.update').as('updateCategory')

        // DELETE Category: Delete a specific category by id
        Route.delete('/:id', 'CategoriesController.delete').as('deleteCategory')
    }).prefix('/categories')
}).prefix('/api')
