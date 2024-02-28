import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { closeSnackbarChat } from 'src/redux/uiSlice';

const Transition = (props: SlideProps) => <Slide {...props} direction="up" />;

const SnackbarChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const {
    ui: { showSnackbarChat, snackbarChatMessage },
    me: { lastProjectId },
  } = useSelector((rootState: RootState) => rootState);

  useEffect(() => {
    if (showSnackbarChat === false) setOpen(false);
    else if (
      location.pathname === Page.Project &&
      lastProjectId === snackbarChatMessage?.project?.id
    )
      dispatch(closeSnackbarChat());
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
      <div
        className="cursor-pointer bg-green p-4 text-center text-white"
        onClick={() => navigate(Page.Project, { state: { id: snackbarChatMessage?.project?.id } })}
      >{`[${snackbarChatMessage?.project?.info.name}] ${snackbarChatMessage?.user?.username}: ${snackbarChatMessage?.content}`}</div>
    </MuiSnackbar>
  );
};

export default SnackbarChat;
