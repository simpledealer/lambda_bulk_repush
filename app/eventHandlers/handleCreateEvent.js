"use strict";

import Promise from 'bluebird';
import CreditApp from "../models/CreditApp";
import CreatedCreditAppEvent from "../models/events/createdCreditAppEvent";
import generateDealerId, { EntryExistsError } from '../utils/dealer';

let record;

export default async function handleCreateEvent({
  event,
  serviceIdentifier,
  logger,
  eventHandler,
  snsPublisher,
  errorHandler
}) {

  let {
    body: { submissionId, promoted }
  } = event;

  //retreive record data to be updated
  const CreditAppQuery = Promise.promisifyAll(CreditApp);
  try {
    const query = CreditAppQuery.query(submissionId)
      .usingIndex("id-index")
      // .where("created_at")
      // .gt(createdAt)
      .limit(1);

    console.log("check retrieve query", { query });

    const execAsync = Promise.promisify(query.exec, {
      context: query
    });
    const { Items: data } = await execAsync();
    record = data[0].attrs;
    console.log(record);
  } catch (err) {
    throw err;
  }

  logger.logItem(`Handling ${event.name}`);

  let status = promoted == 'true' ? 'promoted':'archived';

  const attributes = { ...record, AppStatus: status};
  try {
    const dataAttributes = await CreditAppQuery.createAsync(attributes, {
      overwrite: true
    });
    const createdEvent = new CreatedCreditAppEvent({
      event,
      eventHandler,
      errorHandler,
      service: serviceIdentifier
    });
    const { id } = dataAttributes;
    const newEventContext = {
      submission_id: id,
    };

    const preparedEvent = await createdEvent.prepare({
      data: dataAttributes,
      context: newEventContext,
      body: record
    });
    logger.logItem("event prepared!", { preparedEvent });
    // await snsPublisher.publishEvent(preparedEvent);
    //let creditSubmitResponse = {id: preparedEvent.data.body.id};
    return preparedEvent.toObject().data.body;
  } catch (err) {
    if (err instanceof EntryExistsError) {
      throw new Error("Dealership already exists");
    } else {
      throw err;
    }
  }
}
