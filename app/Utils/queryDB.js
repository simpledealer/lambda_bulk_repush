import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});
import { constructDbTableName } from "@simple_merchant/simplemerchant-apps-utils";
const TABLE_NAME = "APP_CREDENTIALS";
const LAMBDA_STAGE = process.env.stage || "development";

export async function findApps(query) {
  console.log('querying Database');

  let params = {
    TableName: constructDbTableName(LAMBDA_STAGE, TABLE_NAME),
    ExpressionAttributeNames: {
      "#filter": "cms",
    },
    ExpressionAttributeValues: {
      ":filter_val": `${query}`
    },
    FilterExpression: "#filter = :filter_val",
  };
  console.log(params);
  try {
    let data = await docClient.scan(params).promise();
    return data && data.Item
      ? data.Item
      : {
        err: `No data found in ${TABLE_NAME} for ${query}`
      };
  } catch (err) {
    console.log("err getting creds", err);
  }
}
