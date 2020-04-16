const AWS = require('aws-sdk')
const stepfunctions = new AWS.StepFunctions({ apiVersion: '2016-11-23' });

export async function listExecutions() {
  let res;
  console.log('inside listExecutions handler');

  try {
    let params = {
      stateMachineArn: 'arn:aws:states:us-east-1:577195013332:stateMachine:FinanceAppStateMachine-da',
      maxResults: '100',
      // nextToken: 'STRING_VALUE',
      // statusFilter: RUNNING | SUCCEEDED | FAILED | TIMED_OUT | ABORTED
    };

    res = await stepfunctions.listExecutions(params).promise();
    console.log(res);
  } catch (e) { console.log(e); }

  //list available state machines
  // try {
  //   let params = {
  //     maxResults: '100',
  //     // nextToken: 'STRING_VALUE'
  //   };
  //   let res = await stepfunctions.listStateMachines(params).promise();
  //   console.log(res);
  // } catch (e) { console.log(e); }

  console.log('Done.');
  return res;
}