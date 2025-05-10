'use strict';

import { nanoid } from 'nanoid';
import db from '../config/db.js';

export default class Book {

    static async findAll({ name, reading, finished }) {
        try {
            // buat array untuk menyimpan semua kondisi
            const conditions = [];
            const params = [];
            let paramIndex = 1;

            // filter berdasarkan nama
            if (name) {
                conditions.push(`name ILIKE $${paramIndex}`);
                params.push(`%${name}%`);
                paramIndex++;
            }

            // filter berdasarkan status reading
            if (reading !== undefined) {
                const readingValue = parseInt(reading);
                if (readingValue === 0 || readingValue === 1) {
                    conditions.push(`reading = $${paramIndex}`);
                    params.push(readingValue === 1);
                    paramIndex++;
                }
            }

            // filter berdasarkan status finished
            if (finished !== undefined) {
                const finishedValue = parseInt(finished);
                if (finishedValue === 0 || finishedValue === 1) {
                    conditions.push(`finished = $${paramIndex}`);
                    params.push(finishedValue === 1);
                    paramIndex++;
                }
            }

            // menyusun query dengan kondisi WHERE jika ada
            let query = 'SELECT id, name, publisher FROM books';
            
            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(' AND ')}`;
            }

            const result = await db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return [];
        }
    }

    static async findById(id) {
        try {
            const query = 'SELECT * FROM books WHERE id = $1';
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            console.error(`Terjadi kesalahan:`, error);
            return null;
        }
    }

    static async create(bookData) {
        try {
            const id = nanoid(16);
            const { 
                name, year, author, summary, publisher, 
                pageCount, readPage, finished, reading
            } = bookData;
            
            const insertedAt = new Date().toISOString();
            const updatedAt = insertedAt;
            
            const query = `
                INSERT INTO books 
                (id, name, year, author, summary, publisher, 
                 pagecount, readpage, finished, reading, 
                 inserted_at, updated_at) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                RETURNING *
            `;
            
            const values = [
                id, name, year, author, summary, publisher, 
                pageCount, readPage, finished, reading, 
                insertedAt, updatedAt
            ];
            
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            throw error;
        }
    }

    static async update(id, bookData) {
        try {
            const { 
                name, year, author, summary, publisher, 
                pageCount, readPage, finished, reading
            } = bookData;
            
            const updatedAt = new Date().toISOString();
            
            const query = `
                UPDATE books 
                SET name = $1, year = $2, author = $3, summary = $4, 
                    publisher = $5, pagecount = $6, readpage = $7, 
                    finished = $8, reading = $9, updated_at = $10
                WHERE id = $11
                RETURNING *
            `;
            
            const values = [
                name, year, author, summary, publisher, 
                pageCount, readPage, finished, reading, updatedAt, id
            ];
            
            const result = await db.query(query, values);
            return result.rowCount > 0;
        } catch (error) {
            console.error(`Terjadi kesalahan:`, error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const query = 'DELETE FROM books WHERE id = $1';
            const result = await db.query(query, [id]);
            return result.rowCount > 0;
        } catch (error) {
            console.error(`Terjadi kesalahan:`, error);
            throw error;
        }
    }
}