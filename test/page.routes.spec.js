var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app);
var expect = require('chai').expect;

var Page = require('../models').Page;
var User = require('../models').User;

describe('http requests', function () {

    describe('GET /wiki/', function () {
        it('responds with 200', function (done) {
            agent
                .get('/wiki')
                .expect(200, done);
        });
    });

    describe('GET /wiki/add', function () {
        it('responds with 200', function (done) {
            agent
                .get('/wiki/add')
                .expect(200, done);
        });
    });

    describe('GET /wiki/:urlTitle', function () {
        it('responds with 404 on page that does not exist', function (done) {
            agent
                .get('/wiki/' + 'does_not_exist')
                .expect(404, done);
        });

        it('responds with 200 on page that does exist', function (done) {
            Page.create({
                title: "testing testing 1 2 3",
                content: "Mic check.",
                tags: "testing, mic"
            }).then(function (page) {
                agent
                    .get(page.route).expect(200, done);
            })
        });
        afterEach(function (done) {
            Page.destroy({
                where: {
                    title: {
                        $like: 'testing%'
                    }
                }
            }).then(function () {
                done();
            });
        })
    });

    describe('GET /wiki/search', function () {
        it('responds with 200', function (done) {
            agent
                .get('/wiki/search')
                .expect(200, done);
        });
    });

    describe('GET /wiki/:urlTitle/similar', function () {

        it('responds with 404 for page that does not exist', function (done) {
            agent
                .get('/wiki/does_not_exist/similar')
                .expect(404, done);
        });
        it('responds with 200 for similar page', function (done) {
            Page.create({
                title: "testing testing 1 2 3",
                content: "Mic check.",
                tags: "testing, mic"
            }).then(function (page) {
                agent
                    .get(page.route + "/similar")
                    .expect(200, done);
            })
        });

        afterEach(function (done) {
            Page.destroy({
                where: {
                    title: {
                        $like: 'testing%'
                    }
                }
            }).then(function () {
                done();
            });
        });
    });

    describe('POST /wiki', function () {
        it('responds with 302', function(done){
            agent
            .post('/wiki')
            .send({
                name: "Donald Trump",
                email: "trump@yuuuge.com",
                title: "testing testing 1 2 3",
                content: "Mic check.",
                tags: "testing, mic"
            })
            .expect(302, done);
        });

        it('creates a page in the database', function(done){
            Page.findOne({
                where: {
                    urlTitle: "testing_testing_1_2_3"
                }
            }).then(function(page){
                expect(page).to.exist
                expect(page.urlTitle).to.equal("testing_testing_1_2_3");
                Page.destroy({
                    where: {
                        title: {
                            $like: 'testing%'
                        }
                    }
                })
                User.destroy({
                    where: {
                        email: "trump@yuuuge.com"
                    }
                })
                done();
            });
        });
    });

});

// describe ('/ in a get request', function(){
//     it('returns a 200 status')
//
// })
//
// describe ('/ in a post request')
//
// describe ('/search in a get request')
//
// describe ('/:urlTitle in a post request')
//
// describe ('/:urlTitle/delete in a get request')
//
// describe ('/add in a get request')
//
// describe ('/:urlTitle in a get request')
//
// describe ('/:urlTitle/edit in a get request')
//
// describe ('/:urlTitle/similar in a get request')
