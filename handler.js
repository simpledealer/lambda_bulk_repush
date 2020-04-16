"use strict";

import { handleRepush } from "./app/handleRepush";
import { listExecutions } from "./app/listExecutions";

const SUCCESS_STATUS_CODE = 200;
const FAILURE_STATUS_CODE = 500;

// Lambda Handler
export const init = async (event, context, callback) => {
  let response;
  try {
    if (event.httpMethod === 'GET') {
      response = await listExecutions();
    } else {
      response = await handleRepush();
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