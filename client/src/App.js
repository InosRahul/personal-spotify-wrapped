import { useState, useEffect } from 'react';
import { accessToken, logout } from './spotify';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GlobalStyle } from './styles';
import { Login, Profile, TopArtists, TopTracks, Playlists } from './pages';
import styled from 'styled-components/macro';

const StyledLogoutBtn = styled.a`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 0, 0, 0.7);
  color: var(--white);
  font-size: var(--fz-sm);
  font-weight: 700;
  border-radius: var(--border-radius-pill);
  z-index: 10;
  @media (min-width: 768px) {
    right: var(--spacing-lg);
  }
`;

function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(accessToken);
  }, []);
  return (
    <div>
      <GlobalStyle />
      <header>
        {!token ? (
          <Login />
        ) : (
          <>
            <StyledLogoutBtn onClick={logout}>Log Out</StyledLogoutBtn>
            <Router>
              <Switch>
                <Route path="/top-artists">
                  <TopArtists />
                </Route>
                <Route path="/top-tracks">
                  <TopTracks />
                </Route>
                <Route path="/playlists/:id">
                  <h1>Playlist</h1>
                </Route>
                <Route path="/playlists">
                  <Playlists />
                </Route>
                <Route path="/">
                  <Profile />
                </Route>
              </Switch>
            </Router>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
