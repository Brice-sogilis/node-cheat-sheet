import * as chai from 'chai';
import {FruitDealerServer} from "../grpc/FruitDealerServer";
import * as services from "../grpc/definition/fruitdealer_grpc_pb";
import {FruitDealerClient, FruitDealerService} from "../grpc/definition/fruitdealer_grpc_pb";
import * as grpc from "@grpc/grpc-js";
import {
    ClientDuplexStream,
    ClientReadableStream,
    ClientWritableStream,
    credentials,
    Server,
    ServerCredentials,
    ServerDuplexStream,
    ServerReadableStream,
    ServerUnaryCall
} from "@grpc/grpc-js";
import {Apple, Peach, Tomato} from "../grpc/definition/fruitdealer_pb";

const expect = chai.expect;
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

    describe('Calling a gRPC service', function () {
        const server: FruitDealerServer = new FruitDealerServer(FruitDealerServerImpl(3));
        let client: FruitDealerClient;

        before(function (done) {
            server.listen(SERVER_PORT, (err) => {
                if (err) {
                    done(err);
                } else {
                    client = new FruitDealerClient("localhost:" + SERVER_PORT, credentials.createInsecure());
                    done();
                }
            });
        });

        it('Unary call : client -- 1..1 -- server', function (done) {
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
            const responseItems: Tomato[] = [];

            const streamResponse = client.appleForTomatoes(newApple(FRUIT_WEIGHT));

            streamResponse.on('data', (tomato: Tomato) => {
                expect(tomato.getWeight()).to.be.eql(FRUIT_WEIGHT);
                responseItems.push(tomato);
            });

            streamResponse.on('error', (err) => {
                done(err);
            });

            streamResponse.on('end', () => {
                expect(responseItems).to.have.length(TOMATOES_FOR_ONE_APPLE);
                done();
            });
        });

        it('Bidirectional stream : client -- n..n -- server', function (done) {
            const peachA = newPeach(FRUIT_WEIGHT);
            const peachB = newPeach(FRUIT_WEIGHT);
            const peachC = newPeach(FRUIT_WEIGHT);

            const apples: Apple[] = [];

            const duplexStream = client.peachesForApples();

            duplexStream.on('data', (apple: Apple) => {
                expect(apple.getWeight()).to.be.eql(FRUIT_WEIGHT);
                apples.push(apple);
            });

            duplexStream.on('error', (err) => {
                done(err);
            });

            duplexStream.on('end', () => {//this end comes from the server
                expect(apples).to.have.length(3);
                done();
            });

            [peachA, peachB, peachC].forEach(peach => duplexStream.write(peach));
            duplexStream.end();//notify the end of the client request
        });

        after(function (done) {
            server.graceFullyClose(done);
            client.close();
        });

        describe("Unary call : client -- 1..1 -- server", function () {
            let singlePeachResponse: Promise<Peach | undefined>;
            let singleAppleRequest: Apple;

            it('Build a valid request', function () {
                singleAppleRequest = newApple(FRUIT_WEIGHT);
            });

            it('Make an unary call passing a callback to handle the response', function () {
                singlePeachResponse = new Promise((resolve, reject) => {
                    client.appleForPeach(singleAppleRequest, (error, peach) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(peach);
                        }
                    });
                });
            });

            it('Use the response object', async function () {
                const peach = await singlePeachResponse;
                expect(peach).not.to.be.undefined;
                expect(peach!.getWeight()).to.be.eql(FRUIT_WEIGHT);
            });
        });

        describe("Client streaming call", function () {
            let singleAppleResponse: Promise<Apple | undefined>;
            let tomatoStreamRequest: ClientWritableStream<Tomato>;
            let tomatoNumber: number = 3;
            it('Call the service to open the request stream, and pass a callback to handle the response', function () {
                singleAppleResponse = new Promise((resolve, reject) => {
                    tomatoStreamRequest = client.tomatoesForApple((error, apple) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(apple);
                        }
                    });
                });
            });

            it('Start the promise call at constructor call', function () {
                expect(tomatoStreamRequest).not.to.be.undefined;
            });

            it('Write request items into the request stream', function () {
                for (let i = 0; i < tomatoNumber; i++) {
                    tomatoStreamRequest.write(newTomato(FRUIT_WEIGHT));
                }
            });

            it.skip('Request must be ended before the response can be retrieved', async function () {
                const apple = await singleAppleResponse;
                expect(apple).not.to.be.undefined;
                expect(apple!.getWeight()).to.be.eql(FRUIT_WEIGHT * tomatoNumber);
            });

            it('Call end on the stream to notify request completion', function () {
                tomatoStreamRequest.end();
            });

            it('Use the single response item', async function () {
                const apple = await singleAppleResponse;
                expect(apple).not.to.be.undefined;
                expect(apple!.getWeight()).to.be.eql(FRUIT_WEIGHT * tomatoNumber);
            });
        });

        describe("Server streaming call", function () {
            let tomatoesResponse: ClientReadableStream<Tomato>;
            let responseEnd: Promise<void>;
            let tomatoes: Tomato[] = [];
            let singleAppleRequest: Apple;

            it('Build the unary request', function () {
                singleAppleRequest = newApple(FRUIT_WEIGHT);
            });

            it("Open the readable stream by calling the service, set listeners on 'end' and 'error' event to handle the response completion", function () {
                responseEnd = new Promise((resolve, reject) => {
                    tomatoesResponse = client.appleForTomatoes(singleAppleRequest);
                    tomatoesResponse.on('end', () => {
                        resolve();
                    });

                    tomatoesResponse.on('error', (err) => {
                        reject(err);
                    });
                });
            });

            it("Set listeners on 'data' event to handle response items from the stream", function () {
                tomatoesResponse.on('data', (tomato: Tomato) => {
                    expect(tomato.getWeight()).to.be.eql(FRUIT_WEIGHT);
                    tomatoes.push(tomato);
                });
            });

            it("Wait response completion if you need to compute on the entire items set", async function () {
                await responseEnd;
                expect(tomatoes).to.have.length(TOMATOES_FOR_ONE_APPLE);
            });
        });

        describe('Duplex streaming call', function () {
            let duplexStream: ClientDuplexStream<Peach, Apple>;
            let firstItem: Promise<void>;
            let responseEnd: Promise<void>;
            let apples: Apple[] = [];
            const peachNumber = 3;
            it('Open the duplex stream by calling the service', function () {
                duplexStream = client.peachesForApples();
            });

            it("Set listeners on 'end' and 'error' events to handle response completion", function () {
                responseEnd = new Promise((resolve, reject) => {
                    duplexStream.on('end', () => {
                        resolve();
                    });

                    duplexStream.on('error', (err) => {
                        reject(err);
                    });
                });
            });

            it("Set listeners on 'data' event to handle response items from the stream", function () {
                firstItem = new Promise((resolve, _reject) => {
                    duplexStream.on('data', (apple: Apple) => {
                        apples.push(apple);
                        if (apples.length === 1) {
                            resolve();
                        }
                    });
                });
            });

            it("Write the first request item into the duplex stream", function () {
                duplexStream.write(newPeach(FRUIT_WEIGHT));
            });

            it("Response items can be streamed immediately, before request end", async function () {
                await firstItem;
                expect(apples).to.have.length(1);//We only sent 1 item at this point, and this function send 1 response for each item
            });

            it('Write the rest of the request items', function () {
                for (let i = 0; i < peachNumber - 1; i++) {
                    duplexStream.write(newPeach(FRUIT_WEIGHT));
                }
            });

            it("End the duplex stream client side", function () {
                duplexStream.end();
            });

            it("Wait for server-side end of the stream", async function () {
                await responseEnd;
            });

            it("Compute on the entire response items set", function () {
                expect(apples).to.have.length(peachNumber);
            });

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
 * @param tomatoesForOneApple the integer number of tomato received for one apple
 * @constructor
 */
function FruitDealerServerImpl(tomatoesForOneApple: number): services.IFruitDealerServer {
    return {
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
            });

            callStream.on('end', () => {
                const apple = new Apple();
                apple.setWeight(totalWeight);
                callback(null, apple);
            });
        }
    };
}
