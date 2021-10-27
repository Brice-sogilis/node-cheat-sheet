import * as chai from 'chai';
import {FruitDealerServer} from "../grpc/FruitDealerServer";
import * as services from "../grpc/definition/fruitdealer_grpc_pb";
import {FruitDealerClient, FruitDealerService} from "../grpc/definition/fruitdealer_grpc_pb";
import * as grpc from "@grpc/grpc-js";
import {
    credentials,
    Server,
    ServerCredentials,
    ServerDuplexStream,
    ServerReadableStream,
    ServerUnaryCall
} from "@grpc/grpc-js";
import {Apple, Peach, Tomato} from "../grpc/definition/fruitdealer_pb";

const expect = chai.expect;
const assert = chai.assert;
chai.should();

describe('gRPC Framework', function () {
    const TOMATOES_FOR_ONE_APPLE = 3;
    const FRUIT_WEIGHT = 42;
    const SERVER_PORT = 8888;
    describe('Basic server creation, service implementation, and connection with gRPC', function () {
        let client: FruitDealerClient;
        let server: Server;
        it('Create a server via empty constructor', function () {
            server = new Server();
        });

        it('Register a service implementation to the server (see FruitDealerServiceImpl function)', function () {
            server.addService(FruitDealerService, FruitDealerServerImpl(0));
        });

        it('Bind the server async with callback', function (done) {
            server.bindAsync("0.0.0.0:" + SERVER_PORT, ServerCredentials.createInsecure(), done);
        });

        it('Start the server synchronously', function () {
            server.start();
        });

        it('Connect client passing server address and credentials to constructor', function () {
            client = new FruitDealerClient(`localhost:${SERVER_PORT}`, credentials.createInsecure());
        });

        it("Close the gRPC server gracefully async with callback", function (done) {
            server.tryShutdown(done);
        });

        it("Close the client", function () {
            client.close();
        });
    });

    describe('Requesting a gRPC service', function () {
        const server: FruitDealerServer = new FruitDealerServer(FruitDealerServerImpl(3));
        let client: FruitDealerClient;
        before(function (done) {
            server.listen(SERVER_PORT, (err) => {
                client = new FruitDealerClient("localhost:" + SERVER_PORT, credentials.createInsecure());
                done();
            });
        });

        it('Unary request : client -- 1..1 -- server', function (done) {
            client.appleForPeach(newApple(FRUIT_WEIGHT), (error, singlePeachResponse) => {
                if (error) {
                    done(error);
                } else {
                    expect(singlePeachResponse).to.be.not.undefined;
                    expect(singlePeachResponse?.getWeight()).to.be.eql(FRUIT_WEIGHT); //Specific to FruitDealerServerImpl
                    done();
                }
            });
        });

        it('Stream request : client -- n..1 -- server', function (done) {
            const tomatoA = newTomato(FRUIT_WEIGHT);
            const tomatoB = newTomato(FRUIT_WEIGHT);
            const tomatoC = newTomato(FRUIT_WEIGHT);

            //Client method returns a stream to write your request stream items
            const requestStream = client.tomatoesForApple((err, singleAppleResponse) => {
                if (err) {
                    done(err);
                } else {
                    expect(singleAppleResponse).to.be.not.undefined;
                    expect(singleAppleResponse?.getWeight()).to.be.eql(tomatoA.getWeight() + tomatoB.getWeight() + tomatoC.getWeight()); //Specific to FruitDealerServerImpl (a MEGA tomato)
                    done();
                }
            });
            [tomatoA, tomatoB, tomatoC].forEach(t => requestStream.write(t));
            requestStream.end();
        });

        it('Stream response : client -- 1..n -- server', function (done) {
            //Client method returns a stream to read the response items
            const streamResponse = client.appleForTomatoes(newApple(FRUIT_WEIGHT));
            const responseItems : Tomato[] = [];
            streamResponse.on('data', (tomato : Tomato) => {
                expect(tomato.getWeight()).to.be.eql(FRUIT_WEIGHT);
                responseItems.push(tomato);
            });
            streamResponse.on('error', (err) => {
                done(err);
            })
            streamResponse.on('end', () => {
                expect(responseItems).to.have.length(TOMATOES_FOR_ONE_APPLE);
                done();
            });
        });

        it('Bidirectional stream : client -- n..n -- server', function (done) {
            const peachA = newPeach(FRUIT_WEIGHT);
            const peachB = newPeach(FRUIT_WEIGHT);
            const peachC = newPeach(FRUIT_WEIGHT);
            const apples : Apple[] = [];
            const duplexStream = client.peachesForApples();
            duplexStream.on('data',(apple : Apple) => {
                expect(apple.getWeight()).to.be.eql(FRUIT_WEIGHT);
                apples.push(apple);
            });
            [peachA, peachB, peachC].forEach(peach => duplexStream.write(peach));
            duplexStream.end();//notify the end of the client request
            duplexStream.on('end', () => {//this end comes from the server
                expect(apples).to.have.length(3);
               done();
            });
        });

        after(function (done) {
            server.graceFullyClose(done);
            client.close();
        });

    });
});

function newApple(weight: number): Apple {
    const apple = new Apple();
    apple.setWeight(weight);
    return apple;
}

function newTomato(weight: number): Tomato {
    const tomato = new Tomato();
    tomato.setWeight(weight);
    return tomato;
}

function newPeach(weight: number): Peach {
    const peach = new Peach();
    peach.setWeight(weight);
    return peach;
}


/**
 * Object-style creation of an implementation gRPC service FruitDealer
 * Alwas return responses fruits with the same weight as the request ones
 * @param tomatoesForOneApple the integer number of tomato received for one apple
 * @constructor
 */
function FruitDealerServerImpl(tomatoesForOneApple: number): services.IFruitDealerServer {
    const res: services.IFruitDealerServer = {
        appleForPeach(call: ServerUnaryCall<Apple, Peach>, callback: grpc.sendUnaryData<Peach>) {
            const response = new Peach();
            response.setWeight(call.request.getWeight());
            callback(null, response);
        },
        appleForTomatoes(callStream: grpc.ServerWritableStream<Apple, Tomato>) {
            for (let i = 0; i < tomatoesForOneApple; i++) {
                const tomato = new Tomato();
                tomato.setWeight(callStream.request.getWeight());
                callStream.write(tomato)
            }
            callStream.end();
        },
        peachesForApples(callDualStream: ServerDuplexStream<Peach, Apple>) {
            callDualStream.on('data', peach => {
                const apple = new Apple();
                apple.setWeight(peach.getWeight());
                callDualStream.write(apple);
            });
            callDualStream.on('end', () => {
                callDualStream.end();
            })
        },
        tomatoesForApple(callStream: ServerReadableStream<Tomato, Apple>, callback: grpc.sendUnaryData<Apple>) {
            let totalWeight = 0;
            callStream.on('data', tomato => {
                totalWeight += tomato.getWeight();
            })
            callStream.on('end', () => {
                const apple = new Apple();
                apple.setWeight(totalWeight);
                callback(null, apple);
            })
        }
    }
    return res;
}
