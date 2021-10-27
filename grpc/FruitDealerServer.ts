import * as services from './definition/fruitdealer_grpc_pb';
import * as grpc from '@grpc/grpc-js';

export class FruitDealerServer {
    server = new grpc.Server();
    impl: services.IFruitDealerServer;

    constructor(impl: services.IFruitDealerServer) {
        this.impl = impl;
        this.server.addService(services.FruitDealerService, impl)
    }

    listen(port: number, callback: (err: Error | null) => void) {
        this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
            if (err) {
                callback(err);
            } else {
                this.server.start();
                callback(null);
            }
        });
    }

    forceClose() {
        this.server.forceShutdown();
    }

    graceFullyClose(callback: (err: Error | undefined) => void) {
        this.server.tryShutdown(callback);
    }
}