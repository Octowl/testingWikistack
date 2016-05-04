var chai = require("chai");
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

var Page = require('../models').Page;

describe('Page model', function () {

    describe('Virtuals', function () {
        var page;
        var urlTitle = "testisfun"
        beforeEach(function () {
            page = Page.build()
        })

        describe('route', function () {
            it('returns the url_name prepended by "/wiki/"', function () {
                page.urlTitle = urlTitle;
                expect(page.route).to.equal("/wiki/" + urlTitle);
            });
        });
        describe('renderedContent', function () {
            it('converts the markdown-formatted content into HTML', function () {
                page.content = "I am using __markdown__."
                expect(page.renderedContent.trim()).to
                    .equal("<p>I am using <strong>markdown</strong>.</p>");

                page.content = "2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists look like:\n* this one\n* that one\n* the other one "
                expect(page.renderedContent.trim()).to
                    .equal("<p>2nd paragraph. <em>Italic</em>, <strong>bold</strong>, and <code>monospace</code>. Itemized lists look like:</p>\n<ul>\n<li>this one</li>\n<li>that one</li>\n<li>the other one </li>\n</ul>")
            });
        });
    });

    describe('Class methods', function () {
        describe('findByTag', function () {
            // var p1, p2;

            beforeEach(function (done) {
                var page1 = Page.create({
                    title: "testing testing 1 2 3",
                    content: "Mic check.",
                    tags: "testing, mic"
                })

                var page2 = Page.create({
                    title: "testing testing 3 2 1",
                    content: "Is this thing on?",
                    tags: "question, testing"
                })

                Promise.all([page1, page2])
                    .then(function (values) {
                        // p1 = values[0];
                        // p2 = values[1];
                        done();
                    });
            });

            it('gets pages with the search tag', function (done) {
                Page.findByTag('testing').then(function (pages) {
                    expect(pages).to.have.lengthOf(2);
                    pages.forEach(function (page) {
                        expect(page.tags).to.include('testing');
                    })
                    done();
                })
            });

            it('does not get pages without the search tag', function (done) {
                Page.findByTag('question').then(function (pages) {
                        expect(pages).to.have.lengthOf(1);
                        expect(pages[0].tags).to.include('question');
                    }).then(function () {
                        return Page.findByTag('string does not exist')
                    })
                    .then(function (pages) {
                        expect(pages).to.have.lengthOf(0);
                        done();
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
    });

    describe('Instance methods', function () {
        describe('findSimilar', function () {

            var page1, page2, page3;

            beforeEach(function (done) {
                var p1 = Page.create({
                    title: "testing testing 1 2 3",
                    content: "Mic check.",
                    tags: "testing, mic"
                })

                var p2 = Page.create({
                    title: "testing testing 3 2 1",
                    content: "Is this thing on?",
                    tags: "question, testing"
                })

                var p3 = Page.create({
                    title: "testing testing 2 1 3",
                    content: "Can you hear me?",
                    tags: "meaingless, pink_floyd"
                })

                Promise.all([p1, p2, p3])
                    .then(function (values) {
                        page1 = values[0];
                        page2 = values[1];
                        page3 = values[2];
                        done();
                    });
            });

            it('never gets itself', function (done) {
                page1.findSimilar().then(function (pages) {
                    expect(pages[0].tags).not.to.include('mic');
                    done();
                })
            });

            it('gets other pages with any common tags', function (done) {
                page1.findSimilar().then(function (pages) {
                    expect(pages).to.have.lengthOf(1);
                    expect(pages[0].tags).to.include('question');
                    done();
                })
            });

            it('does not get other pages without any common tags', function (done) {
                page3.findSimilar().then(function (pages) {
                    expect(pages).to.have.lengthOf(0);
                    done();
                });
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
    });

    describe('Validations', function () {

        var page

        beforeEach(function () {
            page = Page.build({
                title: "testing testing 1 2 3",
                urlTitle: "testing_testing_1_2_3",
                content: "Mic check.",
            });
        });

        it('errors without title', function (done) {
            page.title = null;
            page.validate().then(function (err) {
                expect(err).to.exist;
                expect(err.errors).to.exist;
                expect(err.errors[0].path).to.equal('title');
                done();
            });
        });
        it('errors without content', function (done) {
            page.content = null;
            page.validate().then(function (err) {
                expect(err).to.exist;
                expect(err.errors).to.exist;
                expect(err.errors[0].path).to.equal('content');
                done();
            });
        });
        it('errors given an invalid status', function (done) {
            page.status = 'not valid';
            page.save().catch(function (err) {
                expect(err).to.exist;
                expect(err.name).to.equal('SequelizeDatabaseError');
                expect(err.message).to.contain("enum_pages_status");
                done();
            });
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

    describe('Hooks', function () {
        it('it sets urlTitle based on title before validating',function(done){
            Page.create({
                title: "testing testing 1 2 3",
                content: "mic check"
            }).then(function(page){
                expect(page.urlTitle).to.equal("testing_testing_1_2_3");
                return Page.destroy({
                    where: {
                        title: {
                            $like: 'testing%'
                        }
                    }
                })
            }).then(function(){
                done();
            })
        });


    });

});

// describe("Page", function () {
//
//     describe("class", function () {
//         it("should exist", function () {
//
//         });
//
//         it("should not allow the creation of a page without a title", function () {
//
//         });
//
//         it("should not allow the creation of a page without content", function () {
//
//         });
//
//         it("has a findByTag method that returns matching instances", function () {
//
//         });
//
//     });
//
//     describe('instance', function() {
//         beforeEach(function () {
//             var expectedPage = {
//                 title: "testing is fun!!",
//                 urlTitle: "testing_is_fun",
//                 route: "/wiki/testing_is_fun",
//
//             }
//             var page = Page.build({
//                 title: "test",
//                 content: "testing is fun",
//                 status: "open"
//             })
//         });
//
//         it("should have the expected properties", function () {
//
//         });
//
//         it("should not have any extra properties", function () {
//
//         });
//
//         it("should have a date close to the date of its creation", function () {
//
//         });
//
//         it("should have a getterMethod that generates the right route", function () {
//
//         });
//
//         it("should convert a string of tags into an array", function(){
//
//         });
//
//         it("has a findSimilar method that returns similar pages", function () {
//
//         });
//     });
// });
