import Tree, { RawNodeDatum } from 'react-d3-tree';
import Modal from 'src/component/Modal';

type Props = {
  open: boolean;
  handleClose: () => void;
};

const ModalTree = ({ open, handleClose }: Props) => {
  const orgChart: RawNodeDatum = {
    name: 'CEO',
    children: [
      {
        name: 'Manager',
        attributes: {
          department: 'Production',
        },
        children: [
          {
            name: 'Foreman',
            attributes: {
              department: 'Fabrication',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
          {
            name: 'Foreman',
            attributes: {
              department: 'Assembly',
            },
            children: [
              {
                name: 'Worker',
              },
            ],
          },
        ],
      },
    ],
  };

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className="h-[calc(100vh-188px)] w-full">
        <Tree data={orgChart} pathFunc="elbow" orientation="vertical" />
      </div>
    </Modal>
  );
};

export default ModalTree;
