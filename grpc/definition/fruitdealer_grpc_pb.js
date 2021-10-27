// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var grpc_definition_fruitdealer_pb = require('../../grpc/definition/fruitdealer_pb.js');

function serialize_fruitdealer_Apple(arg) {
  if (!(arg instanceof grpc_definition_fruitdealer_pb.Apple)) {
    throw new Error('Expected argument of type fruitdealer.Apple');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fruitdealer_Apple(buffer_arg) {
  return grpc_definition_fruitdealer_pb.Apple.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fruitdealer_Peach(arg) {
  if (!(arg instanceof grpc_definition_fruitdealer_pb.Peach)) {
    throw new Error('Expected argument of type fruitdealer.Peach');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fruitdealer_Peach(buffer_arg) {
  return grpc_definition_fruitdealer_pb.Peach.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_fruitdealer_Tomato(arg) {
  if (!(arg instanceof grpc_definition_fruitdealer_pb.Tomato)) {
    throw new Error('Expected argument of type fruitdealer.Tomato');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_fruitdealer_Tomato(buffer_arg) {
  return grpc_definition_fruitdealer_pb.Tomato.deserializeBinary(new Uint8Array(buffer_arg));
}


var FruitDealerService = exports.FruitDealerService = {
  appleForTomatoes: {
    path: '/fruitdealer.FruitDealer/appleForTomatoes',
    requestStream: false,
    responseStream: true,
    requestType: grpc_definition_fruitdealer_pb.Apple,
    responseType: grpc_definition_fruitdealer_pb.Tomato,
    requestSerialize: serialize_fruitdealer_Apple,
    requestDeserialize: deserialize_fruitdealer_Apple,
    responseSerialize: serialize_fruitdealer_Tomato,
    responseDeserialize: deserialize_fruitdealer_Tomato,
  },
  appleForPeach: {
    path: '/fruitdealer.FruitDealer/appleForPeach',
    requestStream: false,
    responseStream: false,
    requestType: grpc_definition_fruitdealer_pb.Apple,
    responseType: grpc_definition_fruitdealer_pb.Peach,
    requestSerialize: serialize_fruitdealer_Apple,
    requestDeserialize: deserialize_fruitdealer_Apple,
    responseSerialize: serialize_fruitdealer_Peach,
    responseDeserialize: deserialize_fruitdealer_Peach,
  },
  tomatoesForApple: {
    path: '/fruitdealer.FruitDealer/tomatoesForApple',
    requestStream: true,
    responseStream: false,
    requestType: grpc_definition_fruitdealer_pb.Tomato,
    responseType: grpc_definition_fruitdealer_pb.Apple,
    requestSerialize: serialize_fruitdealer_Tomato,
    requestDeserialize: deserialize_fruitdealer_Tomato,
    responseSerialize: serialize_fruitdealer_Apple,
    responseDeserialize: deserialize_fruitdealer_Apple,
  },
  peachesForApples: {
    path: '/fruitdealer.FruitDealer/peachesForApples',
    requestStream: true,
    responseStream: true,
    requestType: grpc_definition_fruitdealer_pb.Peach,
    responseType: grpc_definition_fruitdealer_pb.Apple,
    requestSerialize: serialize_fruitdealer_Peach,
    requestDeserialize: deserialize_fruitdealer_Peach,
    responseSerialize: serialize_fruitdealer_Apple,
    responseDeserialize: deserialize_fruitdealer_Apple,
  },
};

exports.FruitDealerClient = grpc.makeGenericClientConstructor(FruitDealerService);
