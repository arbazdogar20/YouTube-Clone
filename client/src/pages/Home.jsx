import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import Card from '../components/Card';
import {publicRequest} from '../utils/requestMethod';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

function Home({type}) {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState();

  const fetchVidoes = async () => {
    try {
      const res = await publicRequest.get(`/videos/${type}`);
      setVideos(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    fetchVidoes();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
}

export default Home;
