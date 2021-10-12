import { useState, useEffect } from 'react';
import { accessToken, getCurrentUserProfile } from './spotify';
import { catchErrors } from './utils';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import styled from 'styled-components/macro';
import { GlobalStyle } from './styles';

const StyledLoginButton = styled.a`
  background-color: green;
  color: white;
  padding: 10px 20px;
  display: inline-block;
  margin: 20px auto;
  border-radius: 30px;
`;

function App() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    setToken(accessToken);

    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
    };
    catchErrors(fetchData());
  }, []);
  return (
    <div className="App">
      <GlobalStyle />
      <header className="App-header">
        {!token ? (
          <StyledLoginButton href="http://localhost:8888/login">
            Log into Spotify
          </StyledLoginButton>
        ) : (
          <Router>
            <Switch>
              <Route path="/top-artists">
                <h1>Top Artists</h1>
              </Route>
              <Route path="/top-tracks">
                <h1>Top Tracks</h1>
              </Route>
              <Route path="/playlists/:id">
                <h1>Playlist</h1>
              </Route>
              <Route path="/playlists">
                <h1>Playlists</h1>
              </Route>
              <Route path="/">
                <>
                  {profile && (
                    <div>
                      <h1>{profile.display_name}</h1>
                      <p>{profile.followers.total} Followers</p>
                      {profile.images.length && profile.images[0].url && (
                        <img src={profile.images[0].url} alt="Avatar" />
                      )}
                    </div>
                  )}
                </>
              </Route>
            </Switch>
          </Router>
        )}
      </header>
    </div>
  );
}

export default App;
