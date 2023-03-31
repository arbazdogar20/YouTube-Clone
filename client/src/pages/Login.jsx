import React, {useEffect, useState} from 'react';
// import { Link } from 'react-router-dom'
import styled from 'styled-components';
import {publicRequest} from '../utils/requestMethod';

// React Redux
import {useDispatch, useSelector} from 'react-redux';
import {loginFailure, loginStart, loginSuccess} from '../redux/userSlice';

// Firebase
import {auth, provider} from '../firebase';
import {signInWithPopup} from 'firebase/auth';
import {useNavigate} from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 56px);
  color: ${({theme}) => theme.text};
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${({theme}) => theme.bgLighter};
  border: 1px solid ${({theme}) => theme.soft};
  padding: 20px 50px;
  gap: 10px;
`;
const Title = styled.h1`
  font-size: 24px;
`;
const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;
const Input = styled.input`
  border: 1px solid ${({theme}) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  color: ${({theme}) => theme.text};
  width: 100%;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${({theme}) => theme.soft};
  color: ${({theme}) => theme.textSoft};
  background-color: ${(props) => props.btn === 'google' && 'red'};
  color: ${(props) => props.btn === 'google' && 'white'}; ;
`;
const More = styled.div`
  display: flex;
  font-size: 10px;
  color: ${({theme}) => theme.textSoft};
  margin-top: 10px;
`;
const Links = styled.div`
  margin-left: 50px;
`;
const Link = styled.span`
  margin-left: 30px;
`;

function Login() {
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await publicRequest.post('/auth/signin', {name, password});
      navigate('/');
      dispatch(loginSuccess(res.data));
    } catch (error) {
      dispatch(loginFailure());
      console.log(error);
    }
  };

  // Google Authentication
  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        // console.log(result.user);
        publicRequest
          .post('/auth/google', {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
            password: 'there is no password because Its come from google',
          })
          .then((res) => {
            navigate('/');
            dispatch(loginSuccess(res.data));
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        dispatch(loginFailure());
        console.log(e.response.data);
      });
  };

  const handleRegister = async () => {};

  return (
    <Container>
      <Wrapper>
        <Title>SignIn</Title>
        <SubTitle>to continue to LamaTube</SubTitle>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign In</Button>
        <Title>or</Title>
        <Button btn={'google'} onClick={signInWithGoogle}>
          SignIn With Google
        </Button>
        <Input
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleRegister}>Sign Up</Button>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
}

export default Login;
