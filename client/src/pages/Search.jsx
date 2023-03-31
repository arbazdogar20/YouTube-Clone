import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import styled from 'styled-components';
import Card from '../components/Card';
import {publicRequest} from '../utils/requestMethod';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

function Search() {
  const [videos, setVideos] = useState([]);

  const val = useLocation().search.split('=')[1];

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await publicRequest.get(`/videos/search?search=${val}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [val]);

  return (
    <Container>
      {videos.map((v) => (
        <Card key={v._id} video={v} />
      ))}
    </Container>
  );
}

export default Search;
