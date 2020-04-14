"use strict";

import Promise from "bluebird";
import moment from "moment";
import CreditApp from "../models/CreditApp";

const LIST_LIMIT = 100;

export default async function handleListEvent({ event, logger }) {
    let {
        body: { dealer, name },
        body,
        stage,
        context,
        authUser: userId,
        requestTag
    } = event;
    logger.logItem(`Handling ${event.name}`);

    const appId = context.id__app;
    const dealerName = dealer;
    const createdAt = moment()
        .subtract(100, "day")
        .toDate();
    console.log("check params", {
        dealerName,
        createdAt,
        dealer
    });
    const CreditAppQuery = Promise.promisifyAll(CreditApp);
    try {
        let query = CreditAppQuery.query(dealerName)
            .usingIndex("name__dealership-created_at-index")
            .where("created_at")
            .gt(createdAt)
            .descending();

        if (name) {

            let sanitisedName = sanitiseName(name);

            query = CreditAppQuery.query(dealerName)
                .usingIndex("name__dealership-created_at-index")
                .where("created_at")
                .gt(createdAt)
                .descending()
                .filter('name__full').contains(sanitisedName);

        }

        /*
        .limit(LIST_LIMIT)
        */

        console.log("check query", { query });

        const execAsync = Promise.promisify(query.exec, {
            context: query
        });
        const { Items: data } = await execAsync();
        return data;
    } catch (err) {
        throw err;
    }
}

function sanitiseName(name) {
    //remove double spaces
    let removedDoubleSpaces = name.replace(/ +(?= )/g, '');

    //trim trailing white spaces
    let removedDoubleWhiteSpaces = removedDoubleSpaces.trim();

    //hyphenate Name
    let hyphenatedName = titleCase(removedDoubleWhiteSpaces);

    return hyphenatedName;
}

function titleCase(str) {
    var splitStr = str.split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join('-');
}