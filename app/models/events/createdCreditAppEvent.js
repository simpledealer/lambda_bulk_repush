const EVENT_NAME = "CREATED__DATABASE__DEALERSHIP__ROOT";

class CreatedCreditAppEvent {
  constructor({ eventHandler, service, event }) {
    this.eventHandler = eventHandler;
    this.service = service;
    this.event = event;
  }

  async prepare({ data, context }) {
    const event = this.event;

    const chainEvent = await this.eventHandler.initializeChainEvent({
      event,
      name: EVENT_NAME,
      nameSchema: "simple_merchant_event_names/0-0-2",
      service: this.service,
      context,
      data,
      stage: event.stage,
      authType: "plain",
      authUser: context.name__dealership
    });
    return chainEvent;
  }
}

export default CreatedCreditAppEvent;
