import {
  AddTaskOutlined,
  CleaningServices,
  ReplyOutlined,
  ThumbDown,
  ThumbDownAltOutlined,
  ThumbUp,
  ThumbUpAltOutlined,
} from '@mui/icons-material';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import Comments from '../components/Comments';
import Card from '../components/Card';
import {publicRequest} from '../utils/requestMethod';

import {useDispatch, useSelector} from 'react-redux';
import {
  dislike,
  fetchFailure,
  fetchStart,
  fetchSuccess,
  like,
} from '../redux/videoSlice';
import {useLocation} from 'react-router-dom';
import {format} from 'timeago.js';
import {subscription} from '../redux/userSlice';
import Recommendation from '../components/Recommendation';

const Container = styled.div`
  display: flex;
  gap: 24px;
`;
const Content = styled.div`
  flex: 4;
`;
const VideoWrapper = styled.div``;
const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({theme}) => theme.text};
`;
const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Info = styled.span`
  color: ${({theme}) => theme.textSoft};
`;
const Buttons = styled.div`
  display: flex;
  gap: 10px;
  color: ${({theme}) => theme.text};
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5 px solid ${({theme}) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;
const Image = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50px;
`;
const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({theme}) => theme.text};
`;
const ChannelName = styled.span`
  font-weight: 500;
`;
const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({theme}) => theme.textSoft};
  font-size: 12px;
`;
const Description = styled.p`
  font-size: 14px;
`;
const Subscribe = styled.button`
  background-color: red;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
  /* background-color: aqua; */
`;

function Video() {
  const {currentUser} = useSelector((state) => state.user);
  const {currentVideo} = useSelector((state) => state.video);
  const dispatch = useDispatch();

  const videoId = useLocation().pathname.split('/')[2];

  const [channel, setChannel] = useState({});

  useEffect(() => {
    dispatch(fetchStart());
    const fetchData = async () => {
      try {
        const videoRes = await publicRequest.get(`/videos/find/${videoId}`);
        const channelRes = await publicRequest.get(
          `/users/find/${videoRes.data.userId}`
        );
        await publicRequest.put(`/videos/view/${videoId}`);
        setChannel(channelRes.data);
        dispatch(fetchSuccess(videoRes.data));
      } catch (e) {
        dispatch(fetchFailure());
        console.log(e.response.data);
      }
    };
    fetchData();
  }, [videoId, dispatch]);

  const handleLike = async () => {
    await publicRequest.put(`/users/like/${currentVideo._id}`);
    dispatch(like(currentUser._id));
  };

  const handleDislike = async () => {
    await publicRequest.put(`/users/dislike/${currentVideo._id}`);
    dispatch(dislike(currentUser._id));
  };

  const handleSub = async () => {
    if (currentUser.subscribedUsers.includes(channel._id)) {
      await publicRequest.put(`/users/unsub/${channel._id}`);
    } else {
      await publicRequest.put(`/users/sub/${channel._id}`);
    }
    dispatch(subscription(channel._id));
  };

  return (
    <Container>
      <Content>
        <VideoWrapper>
          <VideoFrame
            src={currentVideo?.videoUrl}
            controls
            preload="auto"
            poster="auto"
          />
        </VideoWrapper>
        <Title>{currentVideo?.title}</Title>
        <Details>
          <Info>
            {currentVideo?.views} views . {format(currentVideo?.createdAt)}
          </Info>
          <Buttons>
            <Button onClick={handleLike}>
              {currentVideo?.likes?.includes(currentUser?._id) ? (
                <ThumbUp />
              ) : (
                <ThumbUpAltOutlined />
              )}
              {currentVideo?.likes?.length}
            </Button>
            <Button onClick={handleDislike}>
              {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                <ThumbDown />
              ) : (
                <ThumbDownAltOutlined />
              )}
              {currentVideo?.dislikes?.length}
            </Button>
            <Button>
              <ReplyOutlined />
              Share
            </Button>
            <Button>
              <AddTaskOutlined />
              Save
            </Button>
          </Buttons>
        </Details>
        <Hr />
        <Channel>
          <ChannelInfo>
            <Image src={channel.img} />
            <ChannelDetails>
              <ChannelName>{channel.name}</ChannelName>
              <ChannelCounter>{channel.subscribers} Subscribers</ChannelCounter>
              <Description>{currentVideo.desc}</Description>
            </ChannelDetails>
          </ChannelInfo>
          <Subscribe onClick={handleSub}>
            {currentUser?.subscribedUsers?.includes(channel._id)
              ? 'Subscribed'
              : 'Subscribe'}
          </Subscribe>
        </Channel>
        <Hr />
        <Comments videoId={currentVideo._id} user={currentUser} />
      </Content>
      <Recommendation tags={currentVideo.tags} />
    </Container>
  );
}

export default Video;
