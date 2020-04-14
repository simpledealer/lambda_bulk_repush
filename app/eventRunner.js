"use strict";

import _ from "lodash";
import { SnsPublisher } from "@simple_merchant/simplemerchant-apps-utils";
import handleCreateEvent from "./eventHandlers/handleCreateEvent";
import handleReadEvent from "./eventHandlers/handleReadEvent";
import handleListEvent from "./eventHandlers/handleListEvent";
import handleDeleteEvent from "./eventHandlers/handleReadEvent";
import handleTagUpdateEvent from "./eventHandlers/handleTagUpdateEvent";

const DEFAULT_LAMBDA_STAGE = "development";
const SERVICE_IDENTIFIER = "SimplemeDealer:DealershipResource";

const LIST_OPERATION = "GET__CREDIT__APPS__ROOT";
const UPDATE_OPERATION = "PUT__CREDIT__APPS__ROOT";
const DELETE_OPERATION = "DELETE__DEALERSHIP__APPLICATIONS__ID";
const READ_OPERATION = "GET__DEALERSHIP__APPLICATIONS__ID";
const UPDATE_TAGS_OPERATION = "PUT__CREDIT__APPS__ID";

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
            case UPDATE_OPERATION:
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
            case UPDATE_TAGS_OPERATION:
                response = await handleTagUpdateEvent({
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