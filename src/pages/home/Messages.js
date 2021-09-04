import React, { useEffect, useState, Fragment } from "react";
import { Col, Form } from "react-bootstrap";
import { useMutation, gql, useLazyQuery } from "@apollo/client";

import { useMessageDispatch, useMessageState } from "../../context/messages";
import Message from "./Message";

const SEND_MESSAGE = gql`
  mutation createMessageForPrivate(
    $senderMail: String!
    $receiverMail: String!
    $message: String!
    $fileUrl: Upload
  ) {
    createMessageForPrivate(
      senderMail: $senderMail
      receiverMail: $receiverMail
      message: $message
      fileUrl: $fileUrl
    ) {
      _id
      author {
        email
        name
      }
      receiverMail {
        email
        name
      }
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessageForPrivate($from: String!) {
    getMessageForPrivate(from: $from) {
      _id
      author {
        _id
        email
        name
      }
      content
      createdAt
      receiverMail {
        email
        _id
        name
      }
      reactions {
        _id
        content
        createdAt
      }
    }
  }
`;

export default function Messages() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  console.log(users)
  const selectedUser = users?.find((u) => u.selected === true);
  console.log(selectedUser)
  let messages = selectedUser?.messages;
  console.log(messages)
  const [message, setMessage] = useState("");

  const [
    getMessagesForPrivate,
    { loading: messagesLoading, data: messagesData },
  ] = useLazyQuery(GET_MESSAGES);

  const [createMessageForPrivate] = useMutation(SEND_MESSAGE, {
    // onCompleted: data => dispatch({ type: 'ADD_MESSAGE', payload: {
    //   username: selectedUser.username,
    //   message: data.createMessageForPrivate
    // }}),
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessagesForPrivate({ variables: { from: selectedUser.email } });
      console.log(selectedUser.email)
      console.log("fdsjaldsfjlkdsjflkjasdlfkjsdlkfjlkasjdfljasdlkfjalds")
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesData) {
      console.log("ddddd")
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          email: selectedUser.email,
          messages: messagesData.getMessageForPrivate,
        },
      });

      console.log(messagesData.getMessageForPrivate)
    }
  }, [messagesData]);

  let submitMessage = (e) => {
    e.preventDefault();
    console.log("fdas")
    if (message.trim() === "" || !selectedUser) return;

    createMessageForPrivate({
      variables: {
        senderMail: "dsafdas",
        receiverMail: selectedUser.email,
        message,
        fileUrl: null,
      },
    });
    setMessage("");
  };

  let selectedChatMarkup;
  console.log(messages)
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a friend</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading...</p>;
  } else if (messages.length > 0) {
    console.log(messages)

    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message._id}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className="info-text">
        You are now connected! send your first messages{" "}
      </p>
    );
  }

  return (
    <Col xs={10} md={8} className="p-0">
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selectedChatMarkup}
      </div>
      <div className="px-3 py-2">
        <Form onSubmit={submitMessage}>
          <Form.Group className="d-flex align-items-center m-0">
            <Form.Control
              type="text"
              className="message-input p-4 rounded-pill bg-secondary border-0"
              placeholder="Type a message.."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <i
              className="fas fa-paper-plane fa-2x text-primary ml-2"
              onClick={submitMessage}
              role="button"
            ></i>
          </Form.Group>
        </Form>
      </div>
    </Col>
  );
}
