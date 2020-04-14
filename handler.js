"use strict";

import { handlePost } from "./app/handlePost";
import { handleGet } from "./app/handleGet";

const SUCCESS_STATUS_CODE = 200;
const FAILURE_STATUS_CODE = 500;

// Lambda Handler
export const init = async (event, context, callback) => {
  let response;
  try {
    if (event.httpMethod === 'GET') {
      response = await handleGet(event);
    } else {
      response = await handlePost(event);
    }
    const successResponse = {
      statusCode: SUCCESS_STATUS_CODE,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Repush for ${response.name__full} forwarded successfully`
      })
    };
    return callback(null, successResponse);
  } catch (err) {
    const errorResponse = {
      statusCode: FAILURE_STATUS_CODE,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: err.message
      })
    };
    return callback(errorResponse);
  }
};