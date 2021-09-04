import React, { useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { gql, useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";

const LOGIN_USER = gql`
  query login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      user {
        _id
        name
        email
      }
      token
    }
  }
`;

export default function Login(props) {
  const [variables, setVariables] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAuthDispatch();

  const [loginUser, { loading, error, data }] = useLazyQuery(LOGIN_USER);
  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;
  if (data) {

    dispatch({ type: "LOGIN", payload: data.login });

  }

  const submitLoginForm = (event) => {
    event.preventDefault();
    console.log(variables);
    loginUser({ variables });
  };

  return (
    <Row className="bg-white py-5 justify-content-center">
      <Col sm={8} md={6} lg={4}>
        <h1 className="text-center">Login</h1>
        <Form onSubmit={submitLoginForm}>
          <Form.Group>
            <Form.Label className={"text-danger"}>{"email"}</Form.Label>
            <Form.Control
              type="email"
              value={variables.email}
              // className={"is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className={"text-danger"}>{"Password"}</Form.Label>
            <Form.Control
              type="password"
              value={variables.password}
              // className={"is-invalid"}
              onChange={(e) =>
                setVariables({ ...variables, password: e.target.value })
              }
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "loading.." : "Login"}
            </Button>
            <br />
          </div>
        </Form>
      </Col>
    </Row>
  );
}
