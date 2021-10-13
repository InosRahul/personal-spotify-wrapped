import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
} from '../spotify';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              {profile.images.length && profile.images[0].url && (
                <img
                  className="header__img"
                  src={profile.images[0].url}
                  alt="Avatar"
                />
              )}
              <div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span>
                    {profile.followers.total} Follower
                    {profile.followers.total !== 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
        </>
      )}
    </>
  );
};

export default Profile;
