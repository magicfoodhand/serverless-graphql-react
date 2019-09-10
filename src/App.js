import React from 'react'
import GraphiQL from 'graphiql'
import 'graphiql/graphiql.css'
import './App.css'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {ApolloProvider, useQuery} from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import {Switch} from "react-router";

function graphQLFetcher(graphQLParams) {
  return fetch('/.netlify/functions/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json())
}

const cache = new InMemoryCache();
const link = new HttpLink({uri: '/.netlify/functions/graphql'})

const client = new ApolloClient({
  cache,
  link
})


const HELLO_QUERY = gql`
  query helloWorld {
    hello
  }
`;

function Index() {
  const { data, loading, error } = useQuery(HELLO_QUERY);
  if (loading) return <p>Loading</p>;
  if (error) return <p>ERROR</p>;

  return (
      <h1>
        {data.hello}
      </h1>
  );
}

let GQL = () => <GraphiQL fetcher={graphQLFetcher} />

let NotFound = () => <div>
  <h1>Not Found</h1>
  <p>This is not the page you're looking for.</p>
</div>

let App = () => <Router>
  <ApolloProvider client={client}>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/graphiql">GraphiQL</Link>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/graphiql" component={GQL} />
        <Route path="/" component={NotFound} />
      </Switch>
    </div>
  </ApolloProvider>
</Router>

export default App
