import { Response } from 'express';
import { Interface } from 'readline';


 const HttpResponseStatus = {
  OK :{
    CODE : 200,
    STATUS : 'OK'
  },
  CREATED :{
    CODE : 201,
    STATUS : 'Data Created'
  },
  NOTFOUND :{
    CODE : 404,
    STATUS : 'NotFoundError',
    MESSAGE : 'Data Not Found'
  },
  INTERNAL_SERVER_ERROR :{
    CODE : 500,
    STATUS : 'InternalServerError'
  },
  BAD_REQUEST :{
    CODE : 400,
    STATUS : 'ValidationError'
  },
}

export interface HttpResponse {
  status: string
}

export interface SuccessResponse<T> extends HttpResponse {
  result?: T,
  code : number,
}

export interface BadRequestResponse<T> extends HttpResponse {
  message: string
  errorCode: number
  errors?: T
}

export interface NotFoundRepsonse<T> extends HttpResponse {
  message: string
  errorCode: number
  errors?: T
}

export interface UnhandledErrorResponse<T> extends HttpResponse {
  message: string
  errorCode: number
  stack?: string | undefined;
}

export class ResponseBuilder {
  static ok = <T>(result?: T, message?: string): SuccessResponse<T> => {
    const response: SuccessResponse<T> = {
      status: message || HttpResponseStatus.OK.STATUS,
      code  : HttpResponseStatus.OK.CODE,
      result: result
    }
    return response
  }

  static created = <T>(result?: T, message?: string): SuccessResponse<T> => {
    const response: SuccessResponse<T> = {
      status: message || HttpResponseStatus.CREATED.STATUS,
      code  : HttpResponseStatus.CREATED.CODE,
      result: result
    }
    return response
  }
  static badRequest = <T>(errors: T, message?: string): BadRequestResponse<T> => {
    const response: BadRequestResponse<T> = {
      status: HttpResponseStatus.BAD_REQUEST.STATUS,
      message: message || "Bad Request",
      errorCode: HttpResponseStatus.BAD_REQUEST.CODE,
      errors: errors
    }
    return response
  }

  static notFound = <T>(message?: string): BadRequestResponse<T> => {
    const response: BadRequestResponse<T> = {
      status: HttpResponseStatus.NOTFOUND.STATUS,
      message: message || "Data Not Found",
      errorCode: HttpResponseStatus.NOTFOUND.CODE,
    }
    return response
  }

  static internalServerError = <T>(message?: string, stack?: T): UnhandledErrorResponse<T> => {
    const response: UnhandledErrorResponse<T> = {
      status: HttpResponseStatus.INTERNAL_SERVER_ERROR.STATUS,
      message: message || "Internal server error",
      errorCode: HttpResponseStatus.INTERNAL_SERVER_ERROR.CODE,
      stack : String(stack)
    }
    return response
  }
}

