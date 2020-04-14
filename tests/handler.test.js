import * as handler from "../handler";

test("init", async () => {
  const event = "event";
  const context = "context";
  const callback = (error, response) => {
    // expect(response.statusCode).toEqual(200);
    // expect(typeof response.body).toBe("string");
  };

  await handler.init(event, context, callback);
});
