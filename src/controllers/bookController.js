import { nanoid } from 'nanoid';
import books from './books.js';
import { HTTP_STATUS, RESPONSE_STATUS } from '../constants/http.js';

export const store = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Validasi: name tidak boleh kosong
    if (!name) {
        const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(HTTP_STATUS.BAD_REQUEST);

        return response;
    }

    // Validasi: readPage tidak boleh lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(HTTP_STATUS.BAD_REQUEST);

        return response;
    }

    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
        status: RESPONSE_STATUS.SUCCESS,
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
        });
        response.code(HTTP_STATUS.CREATED);

        return response;
    }

    const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Buku gagal ditambahkan',
    });
    
    response.code(HTTP_STATUS.SERVER_ERROR);

    return response;
};

export const index = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = [...books];

    // Filter berdasarkan name (case insensitive)
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter(
        (book) => book.name.toLowerCase().includes(name.toLowerCase()),
        );
    }

    // Filter berdasarkan reading status
    if (reading !== undefined) {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter berdasarkan finished status
    if (finished !== undefined) {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    const response = h.response({
        status: RESPONSE_STATUS.SUCCESS,
        data: {
        books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
        })),
        },
    });

    response.code(HTTP_STATUS.OK);

    return response;
};

export const show = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((b) => b.id === bookId);

    if (book !== undefined) {
        return {
        status: RESPONSE_STATUS.SUCCESS,
        data: {
            book,
        },
        };
    }

    const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Buku tidak ditemukan',
    });
    response.code(HTTP_STATUS.NOT_FOUND);

    return response;
};

export const update = (request, h) => {
    const { bookId } = request.params;
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    // Validasi: name tidak boleh kosong
    if (!name) {
        const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(HTTP_STATUS.BAD_REQUEST);

        return response;
    }

    // Validasi: readPage tidak boleh lebih besar dari pageCount
    if (readPage > pageCount) {
        const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(HTTP_STATUS.BAD_REQUEST);

        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        const updatedAt = new Date().toISOString();
        const finished = pageCount === readPage;

        books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
        };

        const response = h.response({
        status: RESPONSE_STATUS.SUCCESS,
        message: 'Buku berhasil diperbarui',
        });
        response.code(HTTP_STATUS.OK);

        return response;
    }

    const response = h.response({
        status: RESPONSE_STATUS.FAIL,
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(HTTP_STATUS.NOT_FOUND);

    return response;
};

export const destroy = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);

    return response;
}