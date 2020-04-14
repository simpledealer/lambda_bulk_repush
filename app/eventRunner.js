"use strict";

import _ from "lodash";
import { SnsPublisher } from "@simple_merchant/simplemerchant-apps-utils";
import handleCreateEvent from "./eventHandlers/handleCreateEvent";
import handleListEvent from "./eventHandlers/handleListEvent";

const DEFAULT_LAMBDA_STAGE = "development";
const SERVICE_IDENTIFIER = "SimplemeDealer:DealershipResource";

const LIST_OPERATION = "GET__CREDIT__APPS__ROOT";
const CREATE_OPERATION = "POST__CREDIT__APPS__ROOT";


export const runWithEvent = async({
    event,
    eventHandler,
    errorHandler,
    logger
}) => {
    logger.logItem("running with event", { name: event.name });
    try {
        const snsPublisher = new SnsPublisher({
            stage: process.env.LAMBDA_STAGE || event.stage || DEFAULT_LAMBDA_STAGE,
            logFunction: logger.logItem
        });
        let response;
        switch (event.name) {
            case CREATE_OPERATION:
                response = await handleCreateEvent({
                    event,
                    snsPublisher,
                    serviceIdentifier: SERVICE_IDENTIFIER,
                    logger,
                    eventHandler,
                    errorHandler
                });
                break;
            case LIST_OPERATION:
                response = await handleListEvent({
                    event,
                    snsPublisher,
                    serviceIdentifier: SERVICE_IDENTIFIER,
                    logger,
                    eventHandler,
                    errorHandler
                });
                break;
            default:
                errorHandler.handleError(new Error("Unrecognized event"), {});
                throw new Error('Unrecognized event "' + event.name + '"');
        }
        const httpResponse = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(response)
        };
        return httpResponse;
    } catch (err) {
        await errorHandler.handleError(err);
        throw err;
    }
};