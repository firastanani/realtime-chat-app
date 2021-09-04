import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthState } from '../context/auth';

export default function DynamicRoute(props) {
  const { user } = useAuthState();
  if(props.guest && user) {
    return <Redirect to="/Home" />
  } else {
    return <Route component={props.component} {...props} />
  }
}