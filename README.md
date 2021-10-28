![Tests](https://github.com/Brice-sogilis/node-cheat-sheet/actions/workflows/test-on-push.yml/badge.svg)
# NodeJS Cheat Sheet

A didactic repository to illustrate nodeJS concepts libraries and framework, using mocha + chai.

## How to use/read this repository

Each file in the **test/** folder illustrate a library or concept by running descriptive tests.
It should act as a quick reminder of how to use these concepts and their related test methods.
Reading these test and understanding their expected outputs should help to grasp the concepts behind the targeted topic.
By running `npm test`, you can display the full test-suite run by mocha, to have an overview of the different topics.

### Why are some test skipped/pending?
Some test cases use the mocha **.skip()** utility. These tests would fail if they were executed, and will be displayed as "pending" in the mocha tests report.
They illustrate situations where -in my opinion- failure is more illustrative than success, or simply as a warning for usual errors. 
You are encouraged to 'unskip' these tests to better understand, or convince yourself of, their failure.

### And if I only want to run one of the test suite ?
Each of the test file encloses its logic in a top level describe(). Using describe.only(), you can run a single file of your choice instead of the whole suite

Enjoy !