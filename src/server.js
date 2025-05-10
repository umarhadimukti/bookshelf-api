'use strict';

import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import bookRoutes from './routes/book.js';

dotenv.config();

const port = process.env.PORT || 9000;

const init = async () => {
    const server = Hapi.server({
        port: port,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    // register routes
    server.route(bookRoutes);

    await server.start();
    console.log('Server sedang berjalan di', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();