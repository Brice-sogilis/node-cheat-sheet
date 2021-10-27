import fs from "fs";
import {assert, expect} from 'chai';

/**
 * Simple counter used to demonstrate various behaviors
 */
export class Counter {
    count: number = 0;

    inc() {
        this.count++;
    }

    reset() {
        this.count = 0;
    }
}

/**
 * Does nothing but does it well
 */
export function noop() {}

/**
 * Alias for chai.assert.ok(true)
 */
export function OK() {assert.ok(true)}

/**
 * Promise version of fs.readdir
 */
export function readFilesAsync() : Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(".", (err, files) => {
            if(err){
                reject(err);
            }
            else{
                resolve(files);
            }
        })
    })
}

/**
 * Demonstration Promise nether calling resolve nor reject
 */
export const infinitePromise = new Promise((_resolve, _reject) => noop);


export const didacticFailureMessage = 'This test fails to illustrate the current concept, .skip when you grasped it';

/**
 * Alias for chai.expect.fail(didacticFailureMessage)
 * Use it for tests meant to illustrate some concept and that can be .skipped
 */
export function failDidactic() {
    expect.fail(didacticFailureMessage);
}