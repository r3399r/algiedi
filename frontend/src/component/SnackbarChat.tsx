import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { closeSnackbarChat } from 'src/redux/uiSlice';

const Transition = (props: SlideProps) => <Slide {...props} direction="up" />;

const SnackbarChat = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { showSnackbarChat, snackbarChatMessage } = useSelector(
    (rootState: RootState) => rootState.ui,
  );

  useEffect(() => {
    if (showSnackbarChat === false) setOpen(false);
    else if (location.pathname === Page.Project) dispatch(closeSnackbarChat());
    else setOpen(true);
  }, [showSnackbarChat]);

  const onClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(closeSnackbarChat());
  };

  return (
    <MuiSnackbar
      classes={{ root: '!left-2 !bottom-2 !translate-x-0' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      autoHideDuration={5000}
    >
      <div className="bg-green p-4 text-center text-white">{snackbarChatMessage}</div>
    </MuiSnackbar>
  );
};

export default SnackbarChat;
