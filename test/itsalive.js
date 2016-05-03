var chai = require("chai");
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe("Simpl tests", function () {
    it("2+2", function () {
        expect(2 + 2).to.equal(4);
    });

    xit("should take approxiamtely 1000ms", function (done) {
        var start = new Date();
        setTimeout(function () {
            var diff = new Date() - start;
            expect(diff).to.be.closeTo(1000,50);
            done();
        }, 1000)
    });
    it("should be able to spy a function and count # of times it was invoked", function () {
        var arr = [2,3,5];
        var func = function(){};
        func = chai.spy(func);
        arr.forEach(func);
        expect(func).to.have.been.called.exactly(arr.length);
    })
});
