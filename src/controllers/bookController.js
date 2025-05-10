'use strict';

import Book from '../models/bookModel.js';

export default {
    getAllBooks: async (request, h) => {
        try {
            const books = await Book.findAll();
            return h.response({
                status: 'success',
                data: {
                    books
                }
            }).code(200);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            }).code(500);
        }
    },

    getBookById: async (request, h) => {
        try {
            const { id } = request.params;
            const book = await Book.findById(id);
            
            if (!book) {
                return h.response({
                    status: 'fail',
                    message: 'Buku tidak ditemukan'
                }).code(404);
            }

            return h.response({
                status: 'success',
                data: {
                    book
                }
            }).code(200);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            }).code(500);
        }
    },

    createBook: async (request, h) => {
        try {
            const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
            
            // Validasi
            if (!name) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. Mohon isi nama buku'
                }).code(400);
            }

            if (readPage > pageCount) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
                }).code(400);
            }

            const finished = (pageCount === readPage);
            
            const newBook = await Book.create({
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading
            });

            return h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: newBook.id
                }
            }).code(201);
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            }).code(500);
        }
    },

    updateBook: async (request, h) => {
        try {
            const { id } = request.params;
            const { 
                name, year, author, summary, publisher, 
                pageCount, readPage, reading 
            } = request.payload;

            // Validasi
            if (!name) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Mohon isi nama buku'
                }).code(400);
            }

            if (readPage > pageCount) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
                }).code(400);
            }

            const book = await Book.findById(id);

            if (!book) {
                return h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. Id tidak ditemukan'
                }).code(404);
            }

            const finished = (pageCount === readPage);

            const result = await Book.update(id, {
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                finished,
                reading
            });

            if (result) {
                return h.response({
                    status: 'success',
                    message: 'Buku berhasil diperbarui'
                }).code(200);
            }

            return h.response({
                status: 'fail',
                message: 'Gagal memperbarui buku'
            }).code(500);
            
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            }).code(500);
        }
    },

    deleteBook: async (request, h) => {
        try {
            const { id } = request.params;
            const book = await Book.findById(id);
            
            if (!book) {
                return h.response({
                    status: 'fail',
                    message: 'Buku gagal dihapus. Id tidak ditemukan'
                }).code(404);
            }

            const result = await Book.delete(id);
            
            if (result) {
                return h.response({
                    status: 'success',
                    message: 'Buku berhasil dihapus'
                }).code(200);
            }

            return h.response({
                status: 'fail',
                message: 'Buku gagal dihapus'
            }).code(500);
            
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
            return h.response({
                status: 'error',
                message: 'Terjadi kesalahan pada server'
            }).code(500);
        }
    }
};