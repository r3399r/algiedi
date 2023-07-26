import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import Button from 'src/component/Button';
import Input from 'src/component/Input';
import { Page } from 'src/constant/Page';
import { Role } from 'src/model/backend/constant/Project';
import { Chat } from 'src/model/backend/entity/ChatEntity';
import { DetailedProject } from 'src/model/backend/Project';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getChatsById, publishProject } from 'src/service/ProjectService';
import Activities from './Activities';
import CollaborateMaster from './CollaborateMaster';
import Info from './Info';
import ModalPublish from './ModalPublish';
import Partners from './Partners';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Collaborate = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [myComment, setMyComment] = useState<string>('');
  const [chats, setChats] = useState<Chat[]>([]);

  const owner = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner)?.user,
    [project],
  );
  const canPublish = useMemo(
    () =>
      project.collaborators.length === project.collaborators.filter((v) => v.isReady).length &&
      project.song?.fileUrl !== null &&
      project.song?.lyricsText !== null,
    [project],
  );

  useEffect(() => {
    getChatsById(project.id).then((res) => setChats(res));
  }, []);

  const { readyState, sendJsonMessage } = useWebSocket('wss://dev.gotronmusic.com/ws', {
    queryParams: { userId },
    shouldReconnect: () => true,
    onMessage: ({ data }) => console.log(data),
    onOpen: () => console.log('open'),
    onClose: () => console.log('close'),
    onError: () => console.log('error'),
  });

  const onPublish = () => {
    publishProject(project.id)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onComment = () => {
    if (readyState !== 1) return;
    sendJsonMessage({
      action: 'chat',
      content: myComment,
      userId,
      projectId: project.id,
    });
    setMyComment('');
  };

  if (!owner) return <>Loading...</>;

  return (
    <>
      <div className="text-[20px] mb-10">Project</div>
      <div className="bg-[#f2f2f2] rounded-xl p-5">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Info project={project} doRefresh={doRefresh} isOwner={owner.id === userId} />
            <CollaborateMaster project={project} doRefresh={doRefresh} />
            <div className="border-[#707070] bg-white border border-solid rounded-2xl p-4 mt-10 mb-4">
              <div className="mb-4 h-[150px] overflow-y-auto flex gap-3 flex-col-reverse">
                {chats.map((v) => (
                  <div key={v.id}>
                    <div className="text-grey text-xs">
                      {format(new Date(v.createdAt ?? ''), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                    <div className="flex-1 whitespace-pre">{v.content}</div>
                  </div>
                ))}
              </div>
              <Input value={myComment} onChange={(e) => setMyComment(e.target.value)} />
              <div className="text-right mt-4">
                <Button size="s" color="transparent" onClick={onComment}>
                  Send
                </Button>
              </div>
            </div>{' '}
          </div>
          <div className="w-1/2">
            <Partners project={project} doRefresh={doRefresh} />
            <Activities project={project} doRefresh={doRefresh} />
          </div>
        </div>
        {owner.id === userId && (
          <div className="text-right mt-4">
            <Button onClick={() => setIsModalOpen(true)} disabled={!canPublish}>
              Publish
            </Button>
          </div>
        )}
      </div>
      <ModalPublish
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        onPublish={onPublish}
        project={project}
      />
    </>
  );
};

export default Collaborate;
