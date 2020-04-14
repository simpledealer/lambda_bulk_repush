console.log("Loading function");
import _ from "lodash";

import {
    SmLogger,
    SnsPublisher,
    ErrorHandler
} from "@simple_merchant/simplemerchant-apps-utils";
import EventHandler from "@simple_merchant/simplemerchant-events-handler";
import { runWithEvent } from "./eventRunner";

const SERVICE_IDENTIFIER = "SimpleDealer:Dealerships_API";
const GET_DEALERSHIPS = "GET__CREDIT_APPS__ROOT";
const GET_DEALERSHIPS_ID = "GET__CREDIT_APPS__ID";
const PUT_DEALERSHIPS_ID_TAGS = "PUT__CREDIT__APPS__ID";

const LAMBDA_STAGE = process.env.LAMBDA_STAGE || 'da';

function eventNameFromPath({ path, method }) {
    const methodName = method.toUpperCase();
    const pathName = "CREDIT__APPS";
    switch (path) {
        case "/credit_apps":
            console.log('in credit apps');
            return `${methodName}__${pathName}__ROOT`;
        case "/credit_apps/{id}":
            console.log("all good name from path");
            return `${methodName}__${pathName}__ID`;
        case "/credit_apps/{id}/tags":
            console.log("request to update credit app tag");
            return `${methodName}__${pathName}__ID`;
        default:
            return GET_DEALERSHIPS_ID;
    }
}

export async function run(_events) {
    const logger = new SmLogger({});
    logger.logItem("inside run function");
    if (_.isEmpty(_events) || _.isNull(_events) || _.isEmpty(_events)) {
        throw new Error("Empty event supplied!");
    } else {
        logger.logItem("check raw event-->>", _events);
    }

    const errorHandler = new ErrorHandler(logger, {
        // event: _events
    });

    try {
        logger.logItem("check initial event", _events);
        const {
            httpMethod: method,
            resource: path,
            pathParameters,
            queryStringParameters,
            body: bodyParams
        } = _events;
        const payload = JSON.parse(bodyParams);
        const body = {...pathParameters, ...queryStringParameters, ...payload };
        const name = eventNameFromPath({ path, method });
        logger.logItem("check event details", {
            name,
            body,
            stage: LAMBDA_STAGE,
            serviceId: SERVICE_IDENTIFIER
        });
        logger.logItem('before event handler', {
            name,
            service: SERVICE_IDENTIFIER,
            context: {},
            data: body,
            stage: LAMBDA_STAGE,
            authUser: "anon"
        });

        let newSMEvent = await EventHandler.initializeRootEvent({
            name,
            service: SERVICE_IDENTIFIER,
            context: {},
            data: body,
            stage: LAMBDA_STAGE,
            authUser: "anon"
        });
        logger.logItem('before event runner')
        const response = await runWithEvent({
            event: newSMEvent,
            eventHandler: EventHandler,
            errorHandler,
            logger
        });
        return response;
    } catch (err) {
        let error;
        if (err.length) {
            error = err[0];
        }

        if (error && error.desc) {
            err = new Error(error.desc);
        }

        await errorHandler.handleError(err, error);
        throw err;
    }
}