import React from 'react'
import { Col, Image } from 'react-bootstrap';
import classNames from 'classnames';
import { gql, useQuery } from '@apollo/client';

import { useMessageDispatch, useMessageState } from '../../context/messages';

const GET_USERS = gql `
query getUsers{
  getUsers{
    _id
    name
    email
    imageUrl
    latestMessage{
       _id
      content
      receiverMail{
        name
      }
       createdAt
      
    }
  }
}

`

export default function Users() {
  const dispatch = useMessageDispatch();
  const { users } = useMessageState();
  console.log(users)
  const selectedUser = users?.find(u => u.selected === true)?.email;
  const {loading} = useQuery(GET_USERS, {
    onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
    onError: err => console.log(err),
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading...</p>
  } else if(users.length === 0) {
    usersMarkup = <p>No users have joined yet.</p>
  } else if(users.length > 0) {
    usersMarkup = users.map((user) => {
      const selected = selectedUser === user.email;
      return (
        <div
          role="button"
          className={classNames("user-div d-flex justify-content-md-start justify-content-center p-3", {'bg-white': selected})}
          key={user.email}
          onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.email })}
        >
          <Image
            src={user.imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            className="user-image"
          />
          <div className="d-none d-md-block ml-2">
            <p className="text-success">{user.email}</p>
            <p className="font-weight-light">
              {user.latestMessage ? user.latestMessage.content : "You are now connected!" }
            </p>
          </div>
        </div>
      )
    });
  }

  return (
    <Col xs={2} md={4} className="p-0 bg-secondary">
      {usersMarkup}
    </Col>
  )
}
