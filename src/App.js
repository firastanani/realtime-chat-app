import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Switch } from 'react-router-dom'

import ApolloProvider from './ApolloProvider';

import './App.scss';
import Login from './pages/Login'
import Home from './pages/home/Home'

import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/messages';
import DynamicRoute from './util/DynamicRoute';

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <Switch>
                <DynamicRoute exact path="/" component={Login} guest/>
                <DynamicRoute path="/Home" component={Home} authenticated/>
                <DynamicRoute path="/login" component={Login} guest/>

              </Switch>
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
      </ApolloProvider>
  );
}

export default App;
