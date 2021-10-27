import {Counter, didacticFailureMessage, failDidactic, infinitePromise, noop, OK, readFilesAsync} from "./common";
import {assert, expect} from "chai";
import fs from 'fs';

describe('Mocha framework', function () {
    it('Setup', noop);

    describe('before, after, afterEach, beforeEach', function () {
        const afterCounter = new Counter();
        describe('before, after', function () {
            const counter = new Counter();
            before('Check that counter is zero and increment it', function () {
                expect(counter.count).to.be.eql(0);
                counter.inc();
            });

            it('Counter should be incremented to 1 at first test', function () {
                expect(counter.count).to.be.eql(1);
            });

            it('Should not be incremented before further tests', function () {
                expect(counter.count).to.be.eql(1);
            });

            it('Should not have incremented the afterCounter before completion', function () {
                expect(afterCounter.count).to.be.eql(0);
            });

            after('Increment upper scope counter', function () {
                afterCounter.inc();
            });
        });

        describe('after', function () {
            it('After counter should have been incremented after the previous sub-suite completion', function () {
                assert.equal(afterCounter.count, 1);
            });
            after('Reset afterCounter', function () {
                afterCounter.reset();
            });
        });

        describe('beforeEach', function () {
            const beforeCounter = new Counter();
            const afterCounter = new Counter();
            beforeEach('Increment counter', function () {
                beforeCounter.inc();
            });

            afterEach(function () {
                afterCounter.inc();
            });

            it('Should increment before counter before first test but not the after counter', function () {
                expect(beforeCounter.count).to.be.eql(1);
                expect(afterCounter.count).to.be.eql(0);
            });

            it('Should increment counters before and after each further tests', function () {
                expect(beforeCounter.count).to.be.eql(2);
                expect(afterCounter.count).to.be.eql(1);
            });
        });

        describe("'-Each' and '-All' hooks ordering", function () {
            const beforeAllCounter = new Counter();
            const beforeEachCounter = new Counter();
            const afterAllCounter = new Counter();
            const afterEachCounter = new Counter();
            before('Increment beforeAll counter', function () {
                assert.equal(beforeEachCounter.count, 0, 'beforeAll hooks should be applied prior to beforeEach');
                beforeAllCounter.inc();
            });

            beforeEach('Increment beforeAll counter', function () {
                assert.equal(beforeAllCounter.count, 1, 'beforeAll hooks should be applied prior to beforeEach');
                beforeEachCounter.inc();
            });

            afterEach(function () {
                assert.equal(afterCounter.count, 0, 'afterEach hooks should be applied prior to afterAll')
                afterEachCounter.inc();
            });

            it('Both before counters should be incremented', function () {
                assert.equal(beforeEachCounter.count, 1);
                assert.equal(beforeAllCounter.count, 1);
            });

            after('Increment afterAll counter', function () {
                afterAllCounter.inc();
            });
        });

        describe('Skipping tests', function () {
            it('it(...) Should be executed', function () {
                OK();
            });

            it.skip('it.skip(...) should not be executed', function () {
                expect.fail();
            });
        });

        describe('Using promise, async, or callbacks', function () {
            describe('Async functions', function () {
                it('Mocha accepts async function as test', async function () {
                    const files = await readFilesAsync();
                    assert.ok(files);
                });

                it.skip('Ensure promises resolve when using await or it will timeout', async function () {

                    await infinitePromise;
                    OK();
                });
            });

            describe("Callbacks with 'done'", function () {
                it("You can specify a done argument to test functions, which can be called to specify the end of its execution", function (done) {
                    done();
                });

                it.skip("Passing an error to done indicate a test failure", function (done) {
                    done(new Error(didacticFailureMessage));
                });

                it("The done syntax can be used to test callback methods", function (done) {
                    fs.readdir(".", (err, _files) => {
                        if (err) {
                            done(err);
                        } else {
                            done();
                        }
                    })
                });

                it.skip("Ensure done cannot be called multiple times", function (done) {
                    fs.readdir(".", (_err, _files) => {
                        done();
                    });
                    fs.readdir(".", (_err, _files) => {
                        done();
                    });
                });
            });

            describe('Returning a Promise', function () {
                it('Should behave as if the  function was marked async', function () {
                    return readFilesAsync().then(_files => OK());
                });

                it.skip('Mocha actually wait the returned promise resolution', function () {
                    return readFilesAsync().then(_files => failDidactic());
                });

                it("Nested promises are allowed too", function () {
                    return readFilesAsync().then(_files => readFilesAsync().then(_files => OK()));
                });

                it.skip('Ensure returned promises resolve', function () {
                    return infinitePromise;
                });
            });
        });
    });
});