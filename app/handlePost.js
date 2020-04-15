import AWS from "aws-sdk";
const docClient = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1"
});
import { constructDbTableName } from "@simple_merchant/simplemerchant-apps-utils";
const TABLE_NAME = "APP_CREDENTIALS";
const LAMBDA_STAGE = process.env.stage || "development";

export async function handlePost(_events) {
  console.log('inside Post handler');
  let res = await findApps('trello', 'de');
  console.log(res);
  return;
}

async function findApps(query, stage) {
  let params = {
    TableName: constructDbTableName(stage, TABLE_NAME),
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
