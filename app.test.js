/* eslint-disable no-undef */
'use strict';

const request = require('supertest');
const app = require('./app');

const data = require('./data.json');
const imgs = require('./imgs.json');

describe('Test get all data function', () => {
    test('GET /data success', () => {
        return request(app)
            .get('/data')
            .expect(200);
    });

    test('GET /data returns JSON', () => {
        return request(app)
            .get('/data')
            .expect('Content-type', /json/);
    });

    test('GET /data includes all data in JSON', () => {
        return request(app)
            .get('/data')
            .expect(data);
    });
});

describe('Test search function', () => {
    test('GET /search success', () => {
        return request(app)
            .get('/search')
            .expect(200);
    });
    test('GET /search with keyword success', () => {
        return request(app)
            .get('/search?keyword=Lee')
            .expect(200);
    });

    test('GET /search includes keyword in JSON', () => {
        return request(app)
            .get('/search?keyword=Lee')
            .expect(/Lee/);
    });

    test('GET /search with keyword returns JSON', () => {
        return request(app)
            .get('/search?keyword=Lee')
            .expect('Content-type', /json/);
    });
});

describe('Test add new data function', () => {
    test('POST /adddata success', () => {
        const params = {
            Order: '2019-04-16',
            Date: '16-04-2019',
            Home: 'Test 1 Home',
            HomeTeam: 'Test 1 Home Team',
            Score: '5-5',
            Away: 'Test 1 Away',
            AwayTeam: 'Test 1 Away Team'
        };
        return request(app)
            .post('/adddata')
            .send(params)
            .expect(200);
    });

    test('POST /adddata to be accessed via GET', async () => {
        const params = {
            Order: '2019-04-17',
            Date: '17-04-2019',
            Home: 'Test 2 Home',
            HomeTeam: 'Test 2 Home Team',
            Score: '5-5',
            Away: 'Test 2 Away',
            AwayTeam: 'Test 2 Away Team'
        };

        await request(app)
            .post('/adddata')
            .send(params);

        return request(app)
            .get('/search?keyword=Test')
            .expect(/2019-04-17/);
    });
});

describe('Test get all images function', () => {
    test('GET /imgs success', () => {
        return request(app)
            .get('/imgs')
            .expect(200);
    });

    test('GET /imgs returns JSON', () => {
        return request(app)
            .get('/imgs')
            .expect('Content-type', /json/);
    });

    test('GET /imgs includes all url in JSON', () => {
        return request(app)
            .get('/imgs')
            .expect(imgs);
    });
});

describe('Test add new image function', () => {
    test('POST /addimg success', () => {
        const params = {
            url: 'https://blognumbers.files.wordpress.com/2010/09/1.jpg?w=231&h=300'
        };
        return request(app)
            .post('/addimg')
            .send(params)
            .expect(200);
    });

    test('POST /addimg to be accessed via GET', async () => {
        const params = {
            url: 'https://blognumbers.files.wordpress.com/2010/09/2.jpg?w=231&h=300'
        };

        await request(app)
            .post('/addimg')
            .send(params);

        return request(app)
            .get('/imgs')
            .expect(/2.jpg/);
    });
});
