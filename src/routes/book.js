'use strict';

import bookController from './controllers/book'

export default [
    {
        method: 'GET',
        path: '/books',
        handler: bookController.getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: bookController.getBookById
    },
    {
        method: 'POST',
        path: '/books',
        handler: bookController.createBook,
        options: {
            payload: {
                parse: true,
                allow: ['application/json']
            }
        }
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: bookController.updateBook,
        options: {
            payload: {
                parse: true,
                allow: ['application/json']  
            }
        }
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: bookController.deleteBook
    }
];