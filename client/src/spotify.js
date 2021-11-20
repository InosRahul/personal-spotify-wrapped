import axios from 'axios';

const LOCALSTORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timeStamp: 'spotify_token_timestamp',
};

const EXPIRATION_TIME = 3600 * 1000;

const LOCALSTORAGE_VALUES = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timeStamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timeStamp),
};

export const logout = () => {
  for (const property in LOCALSTORAGE_KEYS) {
    window.localStorage.removeItem(LOCALSTORAGE_KEYS[property]);
  }
  window.location = window.location.reload();
  return;
};

const refreshToken = async () => {
  try {
    const { data } = await axios.get(
      `/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`,
    );
    const { access_token } = data;
    // Update localStorage values
    window.localStorage.setItem(LOCALSTORAGE_KEYS.accessToken, access_token);
    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
    return;
  } catch (e) {
    console.error(e);
  }
};

const getAccessToken = () => {
  const query = new URLSearchParams(window.location.search);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: query.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: query.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: query.get('expires_in'),
  };

  if (Date.now() - Number(LOCALSTORAGE_VALUES.timeStamp) > EXPIRATION_TIME) {
    console.warn('Access token has expired, refreshing...');
    refreshToken();
  }

  const localAccessToken = Number(LOCALSTORAGE_VALUES.accessToken);
  if (
    (!localAccessToken || localAccessToken === 'undefined') &&
    queryParams[LOCALSTORAGE_KEYS.accessToken]
  ) {
    for (const property in queryParams) {
      window.localStorage.setItem(property, queryParams[property]);
    }

    window.localStorage.setItem(LOCALSTORAGE_KEYS.timeStamp, Date.now());

    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }

  return localAccessToken;
};

export const accessToken = getAccessToken();

axios.defaults.baseURL = 'https://api.spotify.com/v1';
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
axios.defaults.headers['Content-Type'] = 'application/json';

export const getCurrentUserProfile = () => axios.get('/me');

export const getCurrentUserPlaylists = () => {
  return axios.get(`/me/playlists`);
};

export const getArtistFollowing = () => {
  return axios.get(`/me/following?type=artist`);
};

export const getTopArtists = (time_range = 'short_term') => {
  return axios.get(`/me/top/artists?time_range=${time_range}`);
};

export const getTopTracks = (time_range = 'short_term') => {
  return axios.get(`/me/top/tracks?time_range=${time_range}`);
};

export const getPlaylistById = playlist_id => {
  return axios.get(`/playlists/${playlist_id}`);
};

export const getAudioFeaturesForTracks = ids => {
  return axios.get(`/audio-features?ids=${ids}`);
};
