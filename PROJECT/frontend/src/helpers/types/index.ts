export interface IGeo {
  lat: string;
  long: string;
}

export interface IAddress {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: IGeo;
}

export interface ICompany {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface IUser {
  email: string;
  password: string;
  url: string;
  payload?: unknown;
  params?: unknown;
  hasAttachment: IGeo | boolean;
}
export enum EHttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}
export interface IParams {
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export interface IGenericOptions {
  url: string;
  params?: IParams;
}

export interface IErrorResponse {
  status: string;
  message: string;
}
export * as IService from "../types";
