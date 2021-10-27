// package: fruitdealer
// file: grpc/definition/fruitdealer.proto

import * as jspb from "google-protobuf";

export class Apple extends jspb.Message {
  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Apple.AsObject;
  static toObject(includeInstance: boolean, msg: Apple): Apple.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Apple, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Apple;
  static deserializeBinaryFromReader(message: Apple, reader: jspb.BinaryReader): Apple;
}

export namespace Apple {
  export type AsObject = {
    weight: number,
  }
}

export class Tomato extends jspb.Message {
  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tomato.AsObject;
  static toObject(includeInstance: boolean, msg: Tomato): Tomato.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tomato, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tomato;
  static deserializeBinaryFromReader(message: Tomato, reader: jspb.BinaryReader): Tomato;
}

export namespace Tomato {
  export type AsObject = {
    weight: number,
  }
}

export class Peach extends jspb.Message {
  getWeight(): number;
  setWeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Peach.AsObject;
  static toObject(includeInstance: boolean, msg: Peach): Peach.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Peach, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Peach;
  static deserializeBinaryFromReader(message: Peach, reader: jspb.BinaryReader): Peach;
}

export namespace Peach {
  export type AsObject = {
    weight: number,
  }
}

