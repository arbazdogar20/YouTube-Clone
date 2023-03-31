import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import styled from 'styled-components';
import {publicRequest} from '../utils/requestMethod';

import Comment from './Comment';

const Container = styled.div``;
const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
const Input = styled.input`
  border: none;
  background-color: transparent;
  border-bottom: 1px solid ${({theme}) => theme.soft};
  outline: none;
  padding: 5px;
  width: 100%;
  color: ${({theme}) => theme.text};
`;

const Button = styled.button`
  margin: 5px;
  float: right;
  padding: 5px;
  border-radius: 10%;
  background-color: ${({theme}) => theme.bgLighter};
  color: ${({theme}) => theme.text};
  cursor: pointer;

  &:hover {
    background-color: red;
    color: white;
    border: 1px solid ${({theme}) => theme.soft};
  }
`;

function Comments({videoId}) {
  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [postComment, setPostComment] = useState('');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await publicRequest.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchComment();
  }, [videoId]);

  const handleComment = async () => {
    try {
      await publicRequest.post('/comments', {
        desc: postComment,
        videoId,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Container>
      <NewComment>
        <Avatar src={currentUser?.img} />
        <Input
          placeholder="Write A Comment..."
          onChange={(e) => setPostComment(e.target.value)}
        />
      </NewComment>
      {postComment.trim().length !== 0 && currentUser && (
        <Button onClick={handleComment}>Comment</Button>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
}

export default Comments;
