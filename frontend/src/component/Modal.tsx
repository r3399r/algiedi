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
      <div className="absolute left-1/2 top-1/2 box-border max-h-[calc(100vh-100px)] w-[920px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white pb-10 pt-12">
        <div
          className="absolute right-4 top-4 cursor-pointer sm:right-6 sm:top-6"
          onClick={onCloseButtonClick}
        >
          x
        </div>
        <div className="h-full max-h-[calc(100vh-188px)] w-full overflow-y-auto px-10">
          {children}
        </div>
      </div>
    </MuiModal>
  );
};

export default Modal;
