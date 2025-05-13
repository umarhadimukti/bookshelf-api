'use strict';

import { index, show, store, update, destroy } from '../controllers/bookController.js';

export default [
    {
        method: 'GET',
        path: '/books',
        handler: index
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: show
    },
    {
        method: 'POST',
        path: '/books',
        handler: store,
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
        handler: update,
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
        handler: destroy
    }
];