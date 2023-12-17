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
      <div className="mb-4 text-xl font-bold">
        Are you sure that you want to start this project?
      </div>
      <div className="flex justify-center gap-4">
        <Button color="purple" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={onStart}>Submit</Button>
      </div>
    </div>
  </Modal>
);

export default ModalStart;
