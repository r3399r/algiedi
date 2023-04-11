import Slide, { SlideProps } from '@mui/material/Slide';
import MuiSnackbar from '@mui/material/Snackbar';
import classnames from 'classnames';
import { SyntheticEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { closeSnackbar } from 'src/redux/uiSlice';

const Transition = (props: SlideProps) => <Slide {...props} direction="up" />;

const Snackbar = () => {
  const dispatch = useDispatch();
  const { showSnackbar, snackbarType, snackbarMessage } = useSelector(
    (rootState: RootState) => rootState.ui,
  );

  const onClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    dispatch(closeSnackbar());
  };

  return (
    <MuiSnackbar
      classes={{ root: '!left-0 !bottom-0 !translate-x-0' }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={Transition}
      open={showSnackbar}
      onClose={onClose}
      autoHideDuration={5000}
    >
      <div
        className={classnames('bg-blue-500 text-white w-screen p-4 text-center', {
          'bg-red-500': snackbarType === 'fail',
        })}
      >
        {snackbarMessage}
      </div>
    </MuiSnackbar>
  );
};

export default Snackbar;
