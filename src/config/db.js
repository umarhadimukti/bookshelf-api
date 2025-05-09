'use strict';

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// konfigurasi postgre
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'bookshelf',
    password: process.env.DB_PASSWORD || 'password',
    port: process.env.DB_PORT || 5432,
});

// tes koneksi
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to PostgreSQL', err);
    } else {
        console.log('PostgreSQL connected successfully at:', res.rows[0].now);
    }
});

export default pool;