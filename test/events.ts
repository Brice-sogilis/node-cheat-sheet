import EventEmitter from 'events';
import {expect} from "chai";
import {Counter} from './common';

const BROADCAST = "broadcast";

//type Listener = (...args : any[]) => void;
class CustomEmitter extends EventEmitter {
    /**
     * Same behavior as 'EventEmitter.on' but returns the added listener
     * @param eventName id of the event to listen
     * @param listener callable listener to register
     * @returns EventListener the added listener, can be passed as parameter to EventEmitter.removeListener()
     */
    registerOn(eventName: string | symbol, listener: EventListener): EventListener {
        super.on(eventName, listener);
        return listener;
    }
}

function numberAppender(target: number[], value: number) {
    return function () {
        target.push(value);
    }
}

function counterIncrementer(target: Counter) {
    return function () {
        target.inc();
    }
}


describe('NodeJS Events emitters/listeners mechanisms', function () {
    const emitter = new CustomEmitter();
    describe("Differences between on and once listeners", function () {
        const onCounter = new Counter();
        const onceCounter = new Counter();
        before(function () {
            emitter.on(BROADCAST, counterIncrementer(onCounter));
            emitter.on(BROADCAST, counterIncrementer(onCounter));
            emitter.once(BROADCAST, counterIncrementer(onceCounter));
            emitter.once(BROADCAST, counterIncrementer(onceCounter));
        });

        beforeEach(function () {
            onCounter.reset();
            onceCounter.reset();
        });
        after(function () {
            emitter.removeAllListeners();
        });

        it('No event listener should be triggered before any emission', function () {
            expect(onCounter.count).to.be.eql(0);
            expect(onceCounter.count).to.be.eql(0);
        });

        it('Should trigger on and once at first emission', function () {
            emitter.emit(BROADCAST);
            expect(onCounter.count).to.be.eql(2);
            expect(onceCounter.count).to.be.eql(2);
        });

        it('Should only trigger on at second emission', function () {
            emitter.emit(BROADCAST);
            expect(onCounter.count).to.be.eql(2);
            expect(onceCounter.count).to.be.eql(0);
        });
    });

    describe('Listener removal mechanism', function () {
        const counterA = new Counter();
        const counterB = new Counter();
        let listenerA: EventListener;
        let listenerB: EventListener;
        before(function () {
            listenerA = emitter.registerOn(BROADCAST, counterIncrementer(counterA));
            listenerB = emitter.registerOn(BROADCAST, counterIncrementer(counterB));
        });

        beforeEach(function () {
            [counterA, counterB].forEach(c => c.reset());
        });

        it('Should trigger both listener at first event', function () {
            emitter.emit(BROADCAST);
            expect(counterA.count).to.be.eql(1);
            expect(counterB.count).to.be.eql(1);
        });

        it('Should unregister without error when given the first listener reference', function () {
            emitter.removeListener(BROADCAST, listenerA);
        });

        it('Should only trigger the second listener after removal of the first', function () {
            emitter.emit(BROADCAST);
            expect(counterA.count).to.be.eql(0);
            expect(counterB.count).to.be.eql(1);
        });

        it('Should register another listener even when given the same listener two times', function () {
            let listenerC: EventListener = emitter.registerOn(BROADCAST, listenerB);
            expect(listenerC).to.be.eql(listenerB);
            emitter.emit(BROADCAST);
            expect(counterB.count).to.be.eql(2);
        });

        it('Should only remove one listener even when multiple have the same reference', function () {
            emitter.removeListener(BROADCAST, listenerB);
            emitter.emit(BROADCAST);
            expect(counterB.count).to.be.eql(1);
        });

        it('Should remove the other listener when giving the same reference a second time', function () {
            emitter.removeListener(BROADCAST, listenerB);
            emitter.emit(BROADCAST);
            expect(counterB.count).to.be.eql(0);
        });

        after(function () {
            emitter.removeAllListeners();
        });
    });

    describe('Event listening ordering', function () {
        const numberArray: number[] = [];
        const initialMaxListeners = emitter.getMaxListeners();
        const initialListenerCount = 100;
        before(`Increase the listeners limit and add ${initialListenerCount} listeners`, function () {
            emitter.setMaxListeners(initialListenerCount);
            for (let i = 0; i < initialListenerCount; i++) {
                emitter.on(BROADCAST, numberAppender(numberArray, i));
            }
        });

        afterEach('Clear the array', function () {
            numberArray.length = 0;
        });

        it('Should trigger ' + initialListenerCount + ' listeners', function () {
            emitter.emit(BROADCAST);
            expect(numberArray).to.have.length(initialListenerCount);
        });

        it('Should trigger events in order or registration', function () {
            const arrayCopy = numberArray.map(n => n);
            arrayCopy.sort();
            arrayCopy.forEach((n, i) => expect(n).to.be.eql(numberArray[i]));
        });

        after('Remove all listeners and set the limit back to normal', function () {
            emitter.removeAllListeners();
            emitter.setMaxListeners(initialMaxListeners);
        });
    });
});

