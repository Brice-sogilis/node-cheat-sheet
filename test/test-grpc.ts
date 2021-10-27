import * as chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;
chai.should();
import {OK} from "./common";
import {FruitDealerServer, FruitDealerServerImpl} from "../grpc/FruitDealerServer";
import {FruitDealerClient, FruitDealerService} from "../grpc/definition/fruitdealer_grpc_pb";
import {credentials, ServerCredentials, Server} from "@grpc/grpc-js";
import {Apple, Peach, Tomato} from "../grpc/definition/fruitdealer_pb";

describe.only('gRPC Framework', function (){
    const TOMATOES_FOR_ONE_APPLE = 3;
    const SERVER_PORT = 8888;
    describe('Basic server creation and connection with gRPC', function () {
        let client : FruitDealerClient;
        const server = new Server();
        it('Register a service implementation to the server (see FruitDealerServiceImpl function in grpc/FruitDealerServer.ts)', function () {
            server.addService(FruitDealerService, FruitDealerServerImpl(0));
        });

        it('Binds the server async with callback', function (done) {
            server.bindAsync("0.0.0.0:"+SERVER_PORT,ServerCredentials.createInsecure(), done);
        });

        it('Start the server synchronously', function () {
            server.start();
        });

        it('Connect client via constructor', function () {
            client = new FruitDealerClient(`localhost:${SERVER_PORT}`, credentials.createInsecure());
        });

        it("Close the gRPC server gracefully async with callback", function (done) {
            server.tryShutdown(done);
        });
    });

})
