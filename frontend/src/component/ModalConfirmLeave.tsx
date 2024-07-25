import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';
import { RootState } from 'src/redux/store';
import { setHasUnsavedChanges } from 'src/redux/uiSlice';
import ModalConfirm from './ModalConfirm';

type Props = {
  open?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
};

const ModalConfirmLeave = ({ open, onCancel, onConfirm }: Props) => {
  const dispatch = useDispatch();
  const { hasUnsavedChanges } = useSelector((rootState: RootState) => rootState.ui);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = ''; // Chrome requires returnValue to be set

        return ''; // Firefox requires return value to be set
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleCancel = () => {
    if (blocker.reset) blocker.reset();
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    if (blocker.proceed) blocker.proceed();
    if (onConfirm) onConfirm();
    dispatch(setHasUnsavedChanges(false));
  };

  return (
    <ModalConfirm
      text="You made some changes. Are you sure you want to leave?"
      open={open || blocker.state === 'blocked'}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
    />
  );
};

export default ModalConfirmLeave;
