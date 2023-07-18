import Button from 'src/component/Button';
import Modal from 'src/component/Modal';

type Props = {
  open: boolean;
  handleClose: () => void;
  onStart: () => void;
};

const ModalStart = ({ open, handleClose, onStart }: Props) => (
  <Modal open={open} handleClose={handleClose}>
    <div>
      <div>Are you sure you want to start this project?</div>
      <Button onClick={onStart}>Submit</Button>
      <Button color="purple" onClick={handleClose}>
        Cancel
      </Button>
    </div>
  </Modal>
);

export default ModalStart;
