import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {publicRequest} from '../utils/requestMethod';
import Card from './Card';

const Container = styled.div`
  flex: 2;
`;

function Recommendation({tags}) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await publicRequest.get(`/videos/tags?tags=${tags}`);
        setVideos(res.data);
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
}

export default Recommendation;
