import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Playlist } from 'src/model/Playlist';
import { pushPlaylist, setCurrent } from 'src/redux/playlistSlice';
import { RootState } from 'src/redux/store';

const usePlayer = () => {
  const { playlist } = useSelector((rootState: RootState) => rootState.playlist);
  const dispatch = useDispatch();

  return useCallback(
    (creation: Playlist) => {
      const idx = playlist?.findIndex((v) => v.id === creation.id) ?? -1;
      if (idx < 0) dispatch(pushPlaylist(creation));
      dispatch(setCurrent(idx < 0 ? playlist?.length ?? 0 : idx));
    },
    [playlist],
  );
};

export default usePlayer;
