import Button from 'src/component/Button';
import Modal from 'src/component/Modal';

type Props = {
  text?: string;
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const ModalConfirm = ({ text, open, onCancel, onConfirm }: Props) => (
  <Modal open={open} handleClose={onCancel}>
    <div>
      {text && <div className="mb-2">{text}</div>}
      <div className="flex gap-2">
        <Button color="transparent" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </div>
    </div>
  </Modal>
);

export default ModalConfirm;
