import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Tree, { CustomNodeElementProps, RawNodeDatum } from 'react-d3-tree';
import Modal from 'src/component/Modal';
import IcCover from 'src/image/ic-default-cover.svg';
import { TreeData } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { Role } from 'src/model/backend/constant/Project';

type Props = {
  open: boolean;
  handleClose: () => void;
  tree: TreeData;
};

const ModalTree = ({ open, handleClose, tree }: Props) => {
  const transform = (treeData: TreeData): RawNodeDatum => ({
    name: treeData.creation.info.name ?? '',
    attributes: {
      img: treeData.creation.info.coverFileUrl ?? 0,
      type: treeData.creation.type,
      username:
        treeData.creation.user.length === 1
          ? treeData.creation.user[0].username
          : `${treeData.creation.user.find((v) => v.projectRole === Role.Owner)?.username} & ${
              treeData.creation.user.length - 1
            } others`,
    },
    children: treeData.children?.map((v) => transform(v)),
  });
  const chart = transform(tree);
  const renderNodeElement = ({ nodeDatum }: CustomNodeElementProps) => (
    <g>
      <circle r={15} />
      <foreignObject x="-100" y="-60" width="200" height="200">
        <div className="flex flex-col items-center">
          <img
            src={nodeDatum.attributes?.img ? nodeDatum.attributes.img.toString() : IcCover}
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
          <div className="mt-1 flex text-center text-[14px]">
            {nodeDatum.attributes?.type === Type.Track && (
              <MusicNoteIcon className="text-blue" fontSize="small" />
            )}
            {nodeDatum.attributes?.type === Type.Lyrics && (
              <HistoryEduIcon className="text-red" fontSize="small" />
            )}
            {nodeDatum.attributes?.type === Type.Song && <StarBorderIcon fontSize="small" />}
            <div>{nodeDatum.name}</div>
          </div>
          <div className="text-sm text-grey">{nodeDatum.attributes?.username}</div>
        </div>
      </foreignObject>
    </g>
  );

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className="h-[calc(100vh-188px)] w-full">
        <Tree
          data={chart}
          pathFunc="step"
          orientation="vertical"
          translate={{ x: 400, y: 100 }}
          renderCustomNodeElement={renderNodeElement}
        />
      </div>
    </Modal>
  );
};

export default ModalTree;
