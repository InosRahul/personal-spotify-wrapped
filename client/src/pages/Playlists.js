import { useState, useEffect } from 'react';
import { getCurrentUserPlaylists } from '../spotify';
import axios from 'axios';
import { catchErrors } from '../utils';
import { SectionWrapper, PlaylistsGrid } from '../components';

const Playlists = () => {
  const [playlistsData, setPlaylistsData] = useState(null);
  const [playlists, setPlaylists] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserPlaylists();
      setPlaylistsData(data);
    };
    catchErrors(fetchData());
  }, []);

  useEffect(() => {
    if (!playlistsData) {
      return;
    }

    const fetchMoreData = async () => {
      if (playlistsData.next) {
        const { data } = await axios.get(playlistsData.next);
        setPlaylistsData(data);
      }
    };

    setPlaylists(playlists => [
      ...(playlists ? playlists : []),
      ...playlistsData.items,
    ]);

    catchErrors(fetchMoreData());
  }, [playlistsData]);

  return (
    <main>
      <SectionWrapper title="Playlists" breadcrumb="true">
        {playlists && <PlaylistsGrid playlists={playlists}></PlaylistsGrid>}
      </SectionWrapper>
    </main>
  );
};

export default Playlists;
