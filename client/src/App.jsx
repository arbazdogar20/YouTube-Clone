import React, {useState} from 'react';
import styled, {ThemeProvider} from 'styled-components';

import {darkTheme, lightTheme} from './utils/Theme';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Home from '../src/pages/Home';
import Video from '../src/pages/Video';
import Login from '../src/pages/Login';
import Search from './pages/Search';
import Library from './pages/Library';

import {useSelector} from 'react-redux';

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({theme}) => theme.bg};
`;
const Wrapper = styled.div`
  padding: 22px 96px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const {currentUser} = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          {/* Menu */}
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          {/* main */}
          <Main>
            {/* Navbar */}
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="/trends" element={<Home type="trend" />} />
                  <Route
                    path="/subscription"
                    element={currentUser ? <Home type="sub" /> : <Login />}
                  />
                  <Route
                    path="/library"
                    element={currentUser ? <Library /> : <Login />}
                  />
                  <Route path="/search" element={<Search />} />
                  <Route
                    path="/signin"
                    element={!currentUser ? <Login /> : <Home />}
                  />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
