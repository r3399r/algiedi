import { ModalProps, Modal as MuiModal } from '@mui/material';

type Props = ModalProps & {
  handleClose: () => void;
  disableBackdropClick?: boolean;
};

const Modal = ({ open, handleClose, children, disableBackdropClick = false, ...props }: Props) => {
  const onCloseButtonClick = () => {
    handleClose();
  };

  const onMuiModalClose = (event: object, reason: string) => {
    if (!disableBackdropClick || reason !== 'backdropClick') handleClose();
  };

  return (
    <MuiModal open={open} onClose={onMuiModalClose} {...props}>
      <div className="bg-white rounded-xl w-[920px] box-border pt-12 pb-10 max-h-[calc(100vh-100px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="absolute cursor-pointer top-4 right-4 sm:top-6 sm:right-6"
          onClick={onCloseButtonClick}
        >
          x
        </div>
        <div className="w-full px-10 h-full max-h-[calc(100vh-188px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </MuiModal>
  );
};

export default Modal;
