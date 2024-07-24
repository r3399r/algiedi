import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import ModalConfirm from './ModalConfirm';
import { unstable_useBlocker as useBlocker } from 'react-router-dom';

type Props = {
  open: boolean;
  onCancel: () => void;
  onComfirm: () => void;
};

const ModalConfirmLeave = ({ open, onCancel, onComfirm }: Props) => {
  const { hasUnsavedChanges } = useSelector((rootState: RootState) => rootState.ui);
//   let blocker = useBlocker(
//     ({ currentLocation, nextLocation }) =>
//         hasUnsavedChanges &&
//       currentLocation.pathname !== nextLocation.pathname
//   );
// console.log(blocker)
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

  return (
    <ModalConfirm
      text="You made some changes. Are you sure you want to leave?"
      open={open}
      onCancel={onCancel}
      onComfirm={onComfirm}
    />
  );
};

export default ModalConfirmLeave;
