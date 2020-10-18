import Logger from "./Logger";

export default {
  success: (body?: any) => {
    let response = {
      code: 200,
      body: {data: body || true}
    };
    Logger.info(JSON.stringify(response));
    return response;
  },
  created: (body?: any) => {
    let response = {
      code: 201,
      body: {data: body || true}
    };
    Logger.info(JSON.stringify(response));
    return response;
  },
  notAcceptable: (body?: any) => {
    let response = {
      code: 406,
      body: {data: body || "Value not acceptable"}
    };
    Logger.warn(JSON.stringify(response));
    return response;
  },
  internalServerError: (body?: any) => {
    let response = {
      code: 500,
      body: {data: body || "There was an error. Please try again later."}
    };
    Logger.error(JSON.stringify(response));
    return response;
  },
  notFound: (body?: any) => {
    let response = {
      code: 404,
      body: {data: body || "Data not found"}
    };
    Logger.info(JSON.stringify(response));
    return response;
  },
  unauthorized: (body?: any) => {
    let response = {
      code: 401,
      body: {data: body || 'Request unauthorized.'}
    };
    Logger.error(JSON.stringify(response));
    return response;
  }

}
