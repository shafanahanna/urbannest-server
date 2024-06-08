export const errorHandler = (statusCode, message) => {
  const error = new Error();
  let status;
  let status_code;
  switch (error.status_code) {
    case 404:
      status = "failure";
      break;
    case 401:
      status = "unauthorized";
      break;
    case 500:
      status = "server error";
      break;
    case 403:
      status = "Forbidden";
      break;
  }
  error.message = message;
  return error;
};
