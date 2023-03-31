import styled from 'styled-components';

import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

import {Link, useNavigate} from 'react-router-dom';

// Redux
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../redux/userSlice';
import {useState} from 'react';
import Upload from './Upload';

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({theme}) => theme.bgLighter};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: ${({theme}) => theme.text};
`;

const Input = styled.input`
  border: none;
  background-color: transparent;
  outline: none;
  width: 100%;
  color: ${({theme}) => theme.text};
`;

const Button = styled.button`
  padding: 5px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 3px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${({theme}) => theme.text};
  cursor: pointer;
`;
const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #999;
`;

function Navbar() {
  // const currentUser = useSelector(state => state.user.currentUser);
  const {currentUser} = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Container>
        <Wrapper>
          <Search>
            <Input
              type="text"
              placeholder="search"
              onChange={(e) => setSearch(e.target.value)}
            />
            <SearchOutlinedIcon
              style={{cursor: 'pointer'}}
              onClick={() => navigate(`/search?q=${search}`)}
            />
          </Search>
          {currentUser ? (
            <User>
              <ExitToAppOutlinedIcon onClick={handleLogout} />
              <VideoCallOutlinedIcon onClick={() => setOpen(true)} />
              <Avatar src={currentUser.img} />
              {currentUser.name}
            </User>
          ) : (
            <Link to="/signin" style={{textDecoration: 'none'}}>
              <Button>
                <AccountCircleOutlined />
                SignIn
              </Button>
            </Link>
          )}
        </Wrapper>
      </Container>
      {open && <Upload setOpen={setOpen} />}
    </>
  );
}

export default Navbar;
