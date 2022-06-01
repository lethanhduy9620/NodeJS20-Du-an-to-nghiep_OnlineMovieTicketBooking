"use strict";

const responseData = (message, data = null) => {
  if (data) {
    return {
      message,
      data,
    };
  }

  return { message };
};

const responseDataWithToken = (message, data = null, token) => {
  const reponse = responseData(message, data);
  reponse.token = token;
  return reponse;
};

const responseError = (message, error = null) => {
  if (error) {
    return {
      message,
      error,
    };
  }

  return { message };
};

module.exports = { responseData, responseDataWithToken, responseError };
