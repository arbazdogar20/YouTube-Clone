import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useEffect, useState} from 'react';
import {publicRequest} from '../utils/requestMethod';
import styled from 'styled-components';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {format} from 'timeago.js';

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: 'contain';
`;

// const TableContainer = styled.div``

function Library() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await publicRequest.get('/videos/all');
        // console.log(res.data);
        setVideos(res.data);
      } catch (error) {
        console.log(error.response.message);
      }
    };
    fetchVideos();
  }, []);

  const handleDelete = async (e) => {
    try {
      await publicRequest.delete(`/videos/${e}`);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <TableContainer component={Paper} style={{}}>
      <Table sx={{minWidth: 650}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Desc</TableCell>
            <TableCell align="left">Views</TableCell>
            <TableCell align="left">Posted</TableCell>
            <TableCell align="left">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow
              key={video._id}
              sx={{'&:last-child td, &:last-child th': {border: 0}}}
            >
              <TableCell component="th" scope="row">
                <Image src={video.imgUrl} />
                {/* {} */}
              </TableCell>
              <TableCell align="left">{video.title}</TableCell>
              <TableCell align="left">{video.desc}</TableCell>
              <TableCell align="left">{video.views}</TableCell>
              <TableCell align="left">{format(video.createdAt)}</TableCell>
              <TableCell align="left">
                {
                  <DeleteOutlineOutlinedIcon
                    style={{color: 'red', cursor: 'pointer'}}
                    onClick={() => handleDelete(video._id)}
                  />
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Library;
