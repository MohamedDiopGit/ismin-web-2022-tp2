import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { BookModule } from '../src/book.module';
import { Book } from '../src/Book';
import arrayContaining = jasmine.arrayContaining;

describe('Books API', () => {
  const theLordOfTheRings: Book = {
    title: 'The Lord of the Rings',
    author: 'J. R. R. Tolkien',
    date: '1954-02-15',
  };
  const theHobbit: Book = {
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    date: '1937-09-21',
  };
  const hamlet: Book = {
    title: 'Hamlet',
    author: 'William Shakespeare',
    date: '1600',
  };
  const candide: Book = {
    title: 'Candide',
    author: 'Voltaire',
    date: '1759',
  };
  const aLaRechercheDuTempsPerdu = {
    title: 'À la recherche du temps perdu',
    author: 'Marcel Proust',
    date: '1927',
  };

  let app: INestApplication;
  let httpRequester: supertest.SuperTest<supertest.Test>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [BookModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    httpRequester = request(app.getHttpServer());
  });

  it(`/GET books`, async () => {
    const response = await httpRequester.get('/books').expect(200);

    expect(response.body).toEqual({ data: [], page: 0, total: 0 });
  });

  it(`/POST books`, async () => {
    const response = await httpRequester
      .post('/books')
      .send({
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      })
      .expect(201);

    expect(response.body).toEqual({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
  });

  it(`/GET books/:title`, async () => {
    // First prepare the data by adding a book
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });

    // Then get the previously stored book
    const response = await httpRequester.get('/books/Candide').expect(200);

    expect(response.body).toEqual({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
  });

  it(`/GET books by author`, async () => {
    // First prepare the data by adding some books
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });
    await httpRequester.post('/books').send({
      title: 'Zadig',
      author: 'Voltaire',
      date: '1748',
    });
    await httpRequester.post('/books').send({
      title: 'La Cantatrice chauve',
      author: 'Ionesco',
      date: '1950',
    });

    // Then get the previously stored book
    const response = await httpRequester
      .get('/books')
      .query({ author: 'Voltaire' })
      .expect(200);

    expect(response.body).toEqual([
      {
        title: 'Candide',
        author: 'Voltaire',
        date: '1759',
      },
      {
        title: 'Zadig',
        author: 'Voltaire',
        date: '1748',
      },
    ]);
  });

  it(`/DELETE books/:title`, async () => {
    // First prepare the data by adding a book
    await httpRequester.post('/books').send({
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    });

    // Delete the book
    await httpRequester.delete('/books/Candide').expect(200);

    // Finally check the book was successfully deleted
    const response = await httpRequester.get('/books');

    expect(response.body).toEqual({ data: [], page: 0, total: 0 });
  });

  it(`/POST books/search`, async () => {
    // First prepare the data by adding some books
    const candide = {
      title: 'Candide',
      author: 'Voltaire',
      date: '1759',
    };
    const zadig = {
      title: 'Zadig',
      author: 'Voltaire',
      date: '1748',
    };
    const laCantatriceChauve = {
      title: 'La Cantatrice chauve',
      author: 'Ionesco',
      date: '1950',
    };

    await httpRequester.post('/books').send(candide);
    await httpRequester.post('/books').send(zadig);
    await httpRequester.post('/books').send(laCantatriceChauve);

    const response = await httpRequester
      .post('/books/search')
      .send({
        term: 'can',
      })
      .expect(200);

    expect(response.body).toEqual({
      data: expect.arrayContaining([candide, laCantatriceChauve]),
      page: 0,
      total: 2,
    });
  });

  it(`/POST books with bad payload`, async () => {
    const error = await httpRequester
      .post('/books')
      .send({
        author: '',
        title: 'Candide',
        date: 12,
      })
      .expect(400);

    expect(error.body.message).toEqual([
      'author should not be empty',
      'date must be a string',
    ]);
  });

  it(`/GET books with pagination`, async () => {
    await httpRequester.post('/books').send(candide);
    await httpRequester.post('/books').send(theLordOfTheRings);
    await httpRequester.post('/books').send(aLaRechercheDuTempsPerdu);
    await httpRequester.post('/books').send(hamlet);
    await httpRequester.post('/books').send(theHobbit);

    const response = await httpRequester
      .get('/books')
      .query({ page: 0, size: 2 })
      .expect(200);

    expect(response.body).toEqual({
      data: expect.arrayContaining([aLaRechercheDuTempsPerdu, candide]),
      page: 0,
      total: 5,
    });
  });
});
