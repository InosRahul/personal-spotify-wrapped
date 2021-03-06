import { useState, useEffect } from 'react';
import { catchErrors } from '../utils';
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
  getArtistFollowing,
} from '../spotify';
import {
  ArtistsGrid,
  SectionWrapper,
  TrackList,
  PlaylistsGrid,
  Loader,
} from '../components';
import { StyledHeader } from '../styles';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [following, setFollowing] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile.data);

      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);

      const userTopArtists = await getTopArtists();
      setTopArtists(userTopArtists.data);

      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);

      const userFollowing = await getArtistFollowing();
      setFollowing(userFollowing.data);
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
                  {following && (
                    <span>{following.artists.items.length} Following</span>
                  )}
                </p>
              </div>
            </div>
          </StyledHeader>
          {topArtists && topTracks && playlists ? (
            <main>
              <SectionWrapper
                title="Top artists this month"
                seeAllLink="/top-artists"
              >
                <ArtistsGrid
                  artists={topArtists.items.slice(0, 10)}
                ></ArtistsGrid>
              </SectionWrapper>
              <SectionWrapper
                title="Top Tracks this month"
                seeAllLink="/top-tracks"
              >
                <TrackList tracks={topTracks.items.slice(0, 10)}></TrackList>
              </SectionWrapper>
              <SectionWrapper title="Playlists" seeAllLink="/playlists">
                <PlaylistsGrid
                  playlists={playlists.items.slice(0, 10)}
                ></PlaylistsGrid>
              </SectionWrapper>
            </main>
          ) : (
            <Loader />
          )}
        </>
      )}
    </>
  );
};

export default Profile;
