import React, { useState } from "react";
import classNames from "classnames";
import { useAuthState } from "../../context/auth";
import moment from "moment";
import { OverlayTrigger, Tooltip, Button, Popover } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";

const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎" ];

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($messageId: ID!, $content: String!) {
    reactToMessage(messageId: $messageId, content: $content) {
      _id
      content
      createdAt
    }
  }
`

export default function Message({ message }) {
  let _id = localStorage.getItem("_id");
  let name = localStorage.getItem("name");
  let email = localStorage.getItem("email");
  let userHelper = {
    _id,
    name,
    email,
  };
  const user = userHelper;
  const sent = message.author.email === user.email;
  const received = !sent;
  const [showPopover, setShowPopover] = useState(false);
  const reactionIcon = [...new Set(message.reactions.map((r) => r.content))];

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => setShowPopover(false),
  });

  const react = (reaction) => {
    // console.log(`Reaction ${reaction} to message: ${message.uuid}`);
    reactToMessage({ variables: { messageId: message._id, content: reaction } });
  };

  const reactButton = (
    <OverlayTrigger
      trigger="click"
      placement="top"
      show={showPopover}
      onToggle={setShowPopover}
      transition={false}
      rootClose
      overlay={
        <Popover className="rounded-pill">
          <Popover.Content className="d-flex px-0 py-0 align-items-center react-button-popover">
            {reactions.map((reaction) => (
              <Button
                className="react-icon-button"
                variant="link"
                key={reaction}
                onClick={() => react(reaction)}
              >
                {reaction}
              </Button>
            ))}
          </Popover.Content>
        </Popover>
      }
    >
      <Button variant="link" className="px-2">
        <i className="far fa-smile"></i>
      </Button>
    </OverlayTrigger>
  );

  return (
    <div
      className={classNames("d-flex my-3", {
        "ml-auto": sent,
        "mr-auto": received,
      })}
    >
      {sent && reactButton}
      <OverlayTrigger
        placement={sent ? "right" : "left"}
        overlay={
          <Tooltip>
            {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
          </Tooltip>
        }
        transition={false}
      >
        <div
          className={classNames("py-2 px-3 rounded-pill position-relative", {
            "bg-primary": sent,
            "bg-secondary": received,
          })}
        >
          {message.reactions.length > 0 && (
            <div className="reactions-div bg-secondary p-1 rounded-pill">
              {reactionIcon} {message.reactions.length}
            </div>
          )}
          <p className={classNames({ "text-white": sent })} key={message.uuid}>
            {message.content}
          </p>
        </div>
      </OverlayTrigger>
      {received && reactButton}
    </div>
  );
}
