# Lambda Resources Dealership

### Requirements

* [Install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/installation/)
* [Configure your AWS CLI](https://serverless.com/framework/docs/providers/aws/guide/credentials/)

### Installation

To setup project for development.

```bash
$ git clone https://github.com/simplemerchant/lambda_resources_dealership_info.git
```

Enter the new directory

```bash
$ cd lambda_resources_dealership_info
```

Install the Node.js packages

```bash
$ yarn
```

### Usage

To run unit tests on your local

```bash
$ npm test
```

To run a function on your local

```bash
$ serverless invoke local --function handler
```

Run your tests

```bash
$ npm test
```

We use Jest to run our tests. You can read more about setting up your tests [here](https://facebook.github.io/jest/docs/en/getting-started.html#content).

Deploy your project

```bash
$ serverless deploy
```
