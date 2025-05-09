'use strict';

import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const init = async () => {
    // init pool pg
    const initPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'bookshelf',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    });

    try {
        // cek apakah db sudah ada
        const checkDb = await initPool.query(`
            SELECT 1 FROM pg_database 
            WHERE datname = '${process.env.DB_NAME || 'bookshelf'}'
        `);

        if (checkDb.rowCount === 0) {
            console.log(`creating database: ${process.env.DB_NAME || 'bookshelf'}`);
            await initPool.query(`CREATE DATABASE ${process.env.DB_NAME || 'bookshelf'}`);
            console.log('database created successfully');
        } else {
            console.log(`database ${process.env.DB_NAME || 'bookshelf'} already exists`);
        }
    } catch (err) {
        console.error('error checking/creating database:', err);
    } finally {
        await initPool.end();
    }

    const pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'bookshelf',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
    });

    try {
        // cek apakah tabel book sudah ada
        const checkTable = await pool.query(`
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'books'
        `);

        if (checkTable.rowCount === 0) {
            console.log('Creating books table');
            
            await pool.query(`
                CREATE TABLE books (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    year INTEGER,
                    author VARCHAR(255),
                    summary TEXT,
                    publisher VARCHAR(255),
                    page_count INTEGER NOT NULL,
                    read_page INTEGER,
                    finished BOOLEAN DEFAULT FALSE,
                    reading BOOLEAN DEFAULT FALSE,
                    inserted_at TIMESTAMP WITH TIME ZONE,
                    updated_at TIMESTAMP WITH TIME ZONE
                )
            `);

            // buat indeks
            await pool.query('CREATE INDEX idx_books_name ON books(name)');
            await pool.query('CREATE INDEX idx_books_author ON books(author)');
            
            console.log('Database schema setup completed');
        } else {
            console.log('Books table already exists');
        }

        console.log('Database initialization completed successfully');
    } catch (err) {
        console.error('Error setting up tables:', err);
    } finally {
        await pool.end();
    }
};

init().catch(console.error);