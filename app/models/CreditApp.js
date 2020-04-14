"use strict";

import { constructDbTableName } from "@simple_merchant/simplemerchant-apps-utils";
import Joi from "joi";
import dynogels from "dynogels";
import { EntryExistsError } from '../utils/dealer';

var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB({ region: process.env.SM_AWS_REGION });
// Promise.promisifyAll(require('vogels/lib/scan').prototype);
// Promise.promisifyAll(require('vogels/lib/query').prototype);

const TABLE_NAME = "APPS_METADATA";

let tableName = constructDbTableName(process.env.LAMBDA_STAGE, TABLE_NAME);

console.log("check table name >> ", tableName);

const CreditApp = dynogels.define("CreditApps", {
    hashKey: "id",

    timestamps: true,

    schema: Joi.object()
        .keys({
            id: dynogels.types.uuid()
        })
        .unknown(),
    indexes: [{
            hashKey: "name__dealership",
            rangeKey: 'created_at',
            type: "global",
            name: "name__dealership-created_at-index",

        },
        {
            hashKey: "id",
            type: "global",
            name: "id-index"
        }
    ],

    tableName
});

CreditApp.config({
    dynamodb: dynamodb
});

CreditApp.findOrCreate = function(attributes, done) {
    const getCreditAppAsync = Promise.promisify(CreditApp.get, {
        context: CreditApp
    });
    const createCreditAppAsync = Promise.promisify(CreditApp.create, {
        context: CreditApp
    });

    return getCreditAppAsync(attributes.id__user, attributes.key__channel)
        .then(retrievedApplication => {
            if (!retrievedApplication) {
                return createCreditAppsync(attributes)
                    .then(createdApplication => done(null, createdApplication))
                    .catch(err => done(err));
            }

            return done(null, retrievedApplication);
        })
        .catch(err => done(err));
};

CreditApp.createOrUpdate = function(attributes, done) {
    const updateCreditAppAsync = Promise.promisify(CreditApp.update, {
        context: CreditApp
    });
    const createCreditAppAsync = Promise.promisify(CreditApp.create, {
        context: CreditApp
    });

    return createCreditAppAsync(attributes, { overwrite: false })
        .catch(EntryExistsError => updateCreditAppAsync(attributes))
        .then(application => done(null, application))
        .catch(err => done(err));
};

module.exports = CreditApp;