## Serverless GraphQL + React
[![Netlify Status](https://api.netlify.com/api/v1/badges/a7194115-7d33-44aa-a9da-a0b7f3dc2768/deploy-status)](https://app.netlify.com/sites/serverless-graphql-react/deploys)

This project is built off of [serverless-graphql](https://github.com/lavabear/serverless-graphql).

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/lavabear/serverless-graphql-react)

## Project Setup

**Source**: The main addition to base Create-React-App is a new folder: `src/lambda`. This folder is specified and can be changed in the `package.json` script: `"build:lambda": "netlify-lambda build src/lambda"`.

**GraphQL**: Adds schema and root resolver, includes Graphiql as the React App

**Dist**: Each JavaScript file in there will be built for Netlify Function deployment in `/built-lambda`, specified in [`netlify.toml`](https://www.netlify.com/docs/netlify-toml-reference/).

As an example, we've included a small `src/lambda/hello.js` function, which will be deployed to `/.netlify/functions/hello`.

## Babel/webpack compilation

All functions (inside `src/lambda`) are compiled with webpack using Babel, so you can use modern JavaScript, import npm modules, etc., without any extra setup.

## Local Development

```bash
## prep steps for first time users
yarn global add netlify-cli # Make sure you have the [Netlify CLI](https://github.com/netlify/cli) installed
git clone https://github.com/lavabear/serverless-graphql-react ## clone this repo
cd serverless-graphql-react ## change into this repo
yarn # install all dependencies

## done every time you start up this project
ntl dev ## nice shortcut for `netlify dev`, starts up create-react-app AND a local Node.js server for your Netlify functions
```

This fires up [Netlify Dev](https://github.com/netlify/netlify-dev-plugin/), which:

- Detects that you are running a `create-react-app` project and runs the npm script that contains `react-scripts start`, which in this project is the `start` script
- Detects that you use `netlify-lambda` as a [function builder](https://github.com/netlify/netlify-dev-plugin/#function-builders-function-builder-detection-and-relationship-with-netlify-lambda), and runs the npm script that contains `netlify-lambda build`, which in this project is the `build:lambda` script.

You can view the project locally via Netlify Dev, via `localhost:8888`.

Each function will be available at the same port as well:

- `http://localhost:8888/.netlify/functions/hello` and 
- `http://localhost:8888/.netlify/functions/graphql`

## Deployment

During deployment, this project is configured, inside `netlify.toml` to run the build `command`: `yarn build`.

`yarn build` corresponds to the npm script `build`, which uses `npm-run-all` (aka `run-p`) to concurrently run `"build:app"` (aka `react-scripts build`) and `build:lambda` (aka `netlify-lambda build src/lambda`).

## Typescript

<details>
  <summary>
    <b id="typescript">Click for instructions</b>
  </summary>

You can use Typescript in both your frontend React code (with `react-scripts` v2.1+) and your serverless functions (with `netlify-lambda` v1.1+). Follow these instructions:

1. `yarn add -D typescript @types/node @types/react @types/react-dom @babel/preset-typescript @types/aws-lambda`
2. convert `src/lambda/hello.js` to `src/lambda/hello.ts`
3. use types in your event handler:

```ts
import { Handler, Context, Callback, APIGatewayEvent } from 'aws-lambda'

interface HelloResponse {
  statusCode: number
  body: string
}

const handler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const params = event.queryStringParameters
  const response: HelloResponse = {
    statusCode: 200,
    body: JSON.stringify({
      msg: `Hello world ${Math.floor(Math.random() * 10)}`,
      params,
    }),
  }

  callback(undefined, response)
}

export { handler }
```

rerun and see it work!

You are free to set up your `tsconfig.json` and `tslint` as you see fit.

</details>

**If you want to try working in Typescript on the client and lambda side**: There are a bunch of small setup details to get right. Check https://github.com/sw-yx/create-react-app-lambda-typescript for a working starter.

## Routing and authentication with Netlify Identity

For a full demo of routing and authentication, check this branch: https://github.com/netlify/create-react-app-lambda/pull/18 This example will not be maintained but may be helpful.

## Service Worker

`create-react-app`'s default service worker (in `src/index.js`) does not work with lambda functions out of the box. It prevents calling the function and returns the app itself instead ([Read more](https://github.com/facebook/create-react-app/issues/2237#issuecomment-302693219)). To solve this you have to eject and enhance the service worker configuration in the webpack config. Whitelist the path of your lambda function and you are good to go.
