import * as services from './definition/fruitdealer_grpc_pb';
import * as grpc from '@grpc/grpc-js';
import {Server, ServerDuplexStream, ServerReadableStream, ServerUnaryCall, UntypedHandleCall} from "@grpc/grpc-js";
import {Apple, Peach, Tomato} from "./definition/fruitdealer_pb";

/**
 * Object-style creation of the gRPC service FruitDealer
 * @param tomatoesForOneApple the integer number of tomato received for one apple
 * @constructor
 */
export function FruitDealerServerImpl(tomatoesForOneApple : number) : services.IFruitDealerServer {
    const res : services.IFruitDealerServer = {
        appleForPeach (call : ServerUnaryCall<Apple, Peach>, callback: grpc.sendUnaryData<Peach>)  {
            const response = new Apple();
            response.setWeight(call.request.getWeight());
            callback(null, response);
        },
        appleForTomatoes(callStream : grpc.ServerWritableStream<Apple, Tomato>) {
            for(let i=0; i < tomatoesForOneApple; i++){
                const tomato = new Tomato();
                tomato.setWeight(callStream.request.getWeight());
                callStream.write(tomato)
            }
        },
        peachesForApples(callDualStream : ServerDuplexStream<Peach, Apple>) {
            callDualStream.on('data', peach => {
                const apple = new Apple();
                apple.setWeight(peach.getWeight());
                callDualStream.write(apple);
            });
            callDualStream.on('end', () => {
                callDualStream.end();
            })
        },
        tomatoesForApple( callStream : ServerReadableStream<Tomato, Apple>, callback : grpc.sendUnaryData<Apple>) {
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


export class FruitDealerServer {
    server = new grpc.Server();
    impl : services.IFruitDealerServer;
    constructor(impl : services.IFruitDealerServer) {
        this.impl = impl;
        this.server.addService(services.FruitDealerService, impl)
    }

    listen(port : number, callback : (err: Error|null) => void){
        this.server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err) => {
            if(err){
                callback(err);
            }
            else{
                this.server.start();
                callback(null);
            }
        });
    }

    forceClose(){
        this.server.forceShutdown();
    }

    graceFullyClose(callback : (err : Error|undefined) => void){
        this.server.tryShutdown(callback);
    }
}