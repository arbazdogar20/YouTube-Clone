import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../firebase';
import {publicRequest} from '../utils/requestMethod';
import {useNavigate} from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #0000004c;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled.div`
  width: 500px;
  height: 600px;
  background-color: ${({theme}) => theme.bgLighter};
  color: ${({theme}) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.text};
  cursor: pointer;
`;
const Label = styled.label`
  font-size: 14px;
  color: ${({theme}) => theme.text};
`;

function Upload({setOpen}) {
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const [img, setImg] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [imgPerc, setImgPer] = useState(0);
  const [videoPerc, setVideoPerc] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(','));
  };

  const uploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === 'imgUrl'
          ? setImgPer(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        // console.log('Upload is ' + progress + '% done');
        set;
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default:
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => ({...prev, [urlType]: downloadURL}));
        });
      }
    );
  };

  useEffect(() => {
    video && uploadFile(video, 'videoUrl');
  }, [video]);

  useEffect(() => {
    img && uploadFile(img, 'imgUrl');
  }, [img]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const res = await publicRequest.post('videos', {...inputs, tags});
    setOpen(false);
    if (res.status === 200) navigate(`/video/${res.data._id}`);
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload Video</Title>
        <Label>Video</Label>
        {videoPerc > 0 ? (
          `Uploading ${videoPerc}`
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          name="desc"
          rows={8}
          cols={5}
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Sperate tags with commas e.g music,movies"
          onChange={handleTags}
        />
        <Label>Thumbnail</Label>
        {imgPerc > 0 ? (
          `Uploading ${imgPerc}`
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        )}
        <Button onClick={handleUpload}>Upload</Button>
      </Wrapper>
    </Container>
  );
}

export default Upload;
