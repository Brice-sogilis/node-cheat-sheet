// GENERATED CODE -- DO NOT EDIT!

// package: fruitdealer
// file: grpc/definition/fruitdealer.proto

import * as grpc_definition_fruitdealer_pb from "../../grpc/definition/fruitdealer_pb";
import * as grpc from "@grpc/grpc-js";

interface IFruitDealerService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  appleForTomatoes: grpc.MethodDefinition<grpc_definition_fruitdealer_pb.Apple, grpc_definition_fruitdealer_pb.Tomato>;
  appleForPeach: grpc.MethodDefinition<grpc_definition_fruitdealer_pb.Apple, grpc_definition_fruitdealer_pb.Peach>;
  tomatoesForApple: grpc.MethodDefinition<grpc_definition_fruitdealer_pb.Tomato, grpc_definition_fruitdealer_pb.Apple>;
  peachesForApples: grpc.MethodDefinition<grpc_definition_fruitdealer_pb.Peach, grpc_definition_fruitdealer_pb.Apple>;
}

export const FruitDealerService: IFruitDealerService;

export interface IFruitDealerServer extends grpc.UntypedServiceImplementation {
  appleForTomatoes: grpc.handleServerStreamingCall<grpc_definition_fruitdealer_pb.Apple, grpc_definition_fruitdealer_pb.Tomato>;
  appleForPeach: grpc.handleUnaryCall<grpc_definition_fruitdealer_pb.Apple, grpc_definition_fruitdealer_pb.Peach>;
  tomatoesForApple: grpc.handleClientStreamingCall<grpc_definition_fruitdealer_pb.Tomato, grpc_definition_fruitdealer_pb.Apple>;
  peachesForApples: grpc.handleBidiStreamingCall<grpc_definition_fruitdealer_pb.Peach, grpc_definition_fruitdealer_pb.Apple>;
}

export class FruitDealerClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  appleForTomatoes(argument: grpc_definition_fruitdealer_pb.Apple, metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientReadableStream<grpc_definition_fruitdealer_pb.Tomato>;
  appleForTomatoes(argument: grpc_definition_fruitdealer_pb.Apple, metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientReadableStream<grpc_definition_fruitdealer_pb.Tomato>;
  appleForPeach(argument: grpc_definition_fruitdealer_pb.Apple, callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Peach>): grpc.ClientUnaryCall;
  appleForPeach(argument: grpc_definition_fruitdealer_pb.Apple, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Peach>): grpc.ClientUnaryCall;
  appleForPeach(argument: grpc_definition_fruitdealer_pb.Apple, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Peach>): grpc.ClientUnaryCall;
  tomatoesForApple(callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Apple>): grpc.ClientWritableStream<grpc_definition_fruitdealer_pb.Tomato>;
  tomatoesForApple(metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Apple>): grpc.ClientWritableStream<grpc_definition_fruitdealer_pb.Tomato>;
  tomatoesForApple(metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<grpc_definition_fruitdealer_pb.Apple>): grpc.ClientWritableStream<grpc_definition_fruitdealer_pb.Tomato>;
  peachesForApples(metadataOrOptions?: grpc.Metadata | grpc.CallOptions | null): grpc.ClientDuplexStream<grpc_definition_fruitdealer_pb.Peach, grpc_definition_fruitdealer_pb.Apple>;
  peachesForApples(metadata?: grpc.Metadata | null, options?: grpc.CallOptions | null): grpc.ClientDuplexStream<grpc_definition_fruitdealer_pb.Peach, grpc_definition_fruitdealer_pb.Apple>;
}
