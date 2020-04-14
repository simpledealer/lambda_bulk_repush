"use strict";

import { run } from "./app/index.js";
// Lambda Handler
export const init = async event => {
  try {
    const response = await run(event);
    return response;
  } catch (err) {
    throw err;
  }
};
