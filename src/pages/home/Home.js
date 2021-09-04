import React, { Fragment, useEffect } from "react";
import { Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useSubscription } from "@apollo/client";

import { useAuthDispatch, useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/messages";

import Users from "./Users";
import Messages from "./Messages";

const NEW_MESSAGE = gql`
  subscription newMessageForPrivate {
    newMessageForPrivate {
      _id
      author {
        email
      }

      receiverMail {
        email
      }
      content
      createdAt
    }
  }
`;

const NEW_REACTION = gql`
  subscription newReactionForPrivate {
    newReactionForPrivate {
      _id
      content
      message {
        _id
        author {
          _id
          name
          email
        }
        receiverMail {
          _id
          name
          email
        }
      }
    }
  }
`;

export default function Home() {
  let _id = localStorage.getItem("_id");
  let name = localStorage.getItem("name");
  let email = localStorage.getItem("email");
  let userHelper = {
    _id,
    name,
    email,
  };
  const user = userHelper;

  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);
  if (messageData) {
    console.log(messageData);
  }
  const { data: reactionData, error: reactionError } =
    useSubscription(NEW_REACTION);

  useEffect(() => {
    console.log("fasdfasdfasdfasdfas");

    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessageForPrivate;
      const otherUser =
        user.email === message.receiverMail.email
          ? message.author.email
          : message.receiverMail.email;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: {
          email: otherUser,
          message,
        },
      });
    }
  }, [messageData, messageError]);
  if (reactionData) {
    console.log(reactionData);
  }
  useEffect(() => {
    if (reactionError) console.log(reactionError);
    if (reactionData) {
      const reaction = reactionData.newReactionForPrivate;
      const otherUser =
        user.email === reaction.message.receiverMail.email
          ? reaction.message.author.email
          : reaction.message.receiverMail.email;

      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          email: otherUser,
          reaction,
        },
      });
      console.log(user.email);
      console.log(reaction);
      console.log(reaction.message.receiverMail.email);
      console.log(reaction.message.author.email);
      console.log(user.email === reaction.message.receiverMail.email);
    }
  }, [reactionError, reactionData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <Fragment>
      <Row className="bg-white justify-content-around mb-1">
        <Link to="/login">
          <Button variant="link">Login</Button>
        </Link>
        <Button variant="link" onClick={logout}>
          Logout
        </Button>
      </Row>

      <Row className="bg-white">
        <Users />
        <Messages />
      </Row>
    </Fragment>
  );
}
