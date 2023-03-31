import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {format} from 'timeago.js';
import {publicRequest} from '../utils/requestMethod';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {useSelector} from 'react-redux';

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;
const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50px;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({theme}) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: bold;
`;
const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.textSoft};
  margin-left: 5px;
`;
const Text = styled.span`
  font-size: 14px;
`;

const Trash = styled.span`
  color: ${({theme}) => theme.textSoft};
  margin-left: 300px;
  cursor: pointer;
`;

function Comment({comment}) {
  const [channel, setChannel] = useState({});

  const {currentUser} = useSelector((state) => state.user);
  const {currentVideo} = useSelector((state) => state.video);

  const fetchChannel = async () => {
    try {
      const res = await publicRequest.get(`/users/find/${comment.userId}`);
      setChannel(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [comment.userId]);

  const handleDelete = async (cId) => {
    try {
      const res = await publicRequest.delete(
        `/comments/${cId}/${currentVideo._id}`
      );
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Container>
      <Avatar src={channel?.img} />
      <Details>
        <Name>
          {channel?.name}
          <Date>{format(channel?.createdAt)}</Date>
        </Name>
        <Text>{comment?.desc}</Text>
      </Details>
      {currentUser?._id === comment?.userId && (
        <Trash onClick={() => handleDelete(comment?._id)}>
          <DeleteOutlineOutlinedIcon />
        </Trash>
      )}
    </Container>
  );
}

export default Comment;
