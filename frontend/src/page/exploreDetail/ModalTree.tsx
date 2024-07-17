import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import classNames from 'classnames';
import Tree, { CustomNodeElementProps, RawNodeDatum } from 'react-d3-tree';
import { useNavigate } from 'react-router-dom';
import Modal from 'src/component/Modal';
import { Page } from 'src/constant/Page';
import IcCover from 'src/image/ic-default-cover.svg';
import { TreeData } from 'src/model/backend/api/Explore';
import { Type } from 'src/model/backend/constant/Creation';
import { Role, Status } from 'src/model/backend/constant/Project';

type Props = {
  open: boolean;
  handleClose: () => void;
  tree: TreeData;
  publishedTree: TreeData | null;
};

const ModalTree = ({ open, handleClose, tree, publishedTree }: Props) => {
  const navigate = useNavigate();
  const transform = (treeData: TreeData): RawNodeDatum => ({
    name: treeData.creation.info.name ?? '',
    attributes: {
      id: treeData.creation.id,
      img: treeData.creation.info.coverFileUrl ?? 0,
      type: treeData.creation.type,
      isCollaborator:
        treeData.creation.project !== null &&
        treeData.creation.project.status === Status.Published &&
        treeData.creation.type !== Type.Song,
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
  const renderNodeElement = ({ nodeDatum, onNodeClick }: CustomNodeElementProps) => (
    <g>
      <foreignObject x="-100" y="-60" width="200" height="200">
        <div className="flex flex-col items-center" onClick={onNodeClick}>
          <img
            src={nodeDatum.attributes?.img ? nodeDatum.attributes.img.toString() : IcCover}
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
          <div className="mt-1 flex text-center text-[14px]">
            {nodeDatum.attributes?.isCollaborator && <StarBorderIcon fontSize="small" />}
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
  const renderSongNodeElement = ({ nodeDatum, onNodeClick }: CustomNodeElementProps) => (
    <g>
      <foreignObject x="-100" y="-60" width="200" height="200">
        <div className="flex flex-col items-center" onClick={onNodeClick}>
          <img
            src={nodeDatum.attributes?.img ? nodeDatum.attributes.img.toString() : IcCover}
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
          <div className="mt-1 flex text-center text-[14px]">
            <StarBorderIcon fontSize="small" />
            <div>{nodeDatum.name}</div>
          </div>
          <div className="text-sm text-grey">{nodeDatum.attributes?.username}</div>
        </div>
      </foreignObject>
    </g>
  );

  return (
    <Modal open={open} handleClose={handleClose}>
      <div className="w-full">
        {publishedTree && (
          <div className="h-[150px]">
            <Tree
              data={{
                name: publishedTree.creation.info.name ?? '',
                attributes: {
                  id: publishedTree.creation.id,
                  img: publishedTree.creation.info.coverFileUrl ?? 0,
                  username:
                    publishedTree.creation.user.length === 1
                      ? publishedTree.creation.user[0].username
                      : `${
                          publishedTree.creation.user.find((v) => v.projectRole === Role.Owner)
                            ?.username
                        } & ${publishedTree.creation.user.length - 1} others`,
                },
              }}
              pathFunc="step"
              orientation="vertical"
              translate={{ x: 400, y: 80 }}
              renderCustomNodeElement={renderSongNodeElement}
              draggable={false}
              zoomable={false}
              onNodeClick={(node) => {
                handleClose();
                navigate(`${Page.Explore}/${node.data.attributes?.id}`);
              }}
            />
          </div>
        )}
        <div
          className={classNames({
            'h-[calc(100vh-188px-150px)]': !!publishedTree,
            'h-[calc(100vh-188px)]': !publishedTree,
          })}
        >
          <Tree
            data={chart}
            pathFunc="step"
            orientation="vertical"
            translate={{ x: 400, y: 100 }}
            renderCustomNodeElement={renderNodeElement}
            separation={{ siblings: 1.5 }}
            depthFactor={200}
            zoomable={false}
            onNodeClick={(node) => {
              handleClose();
              navigate(`${Page.Explore}/${node.data.attributes?.id}`);
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalTree;
