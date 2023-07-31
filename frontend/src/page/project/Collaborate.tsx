import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import { Page } from 'src/constant/Page';
import { GetProjectIdChatResponse } from 'src/model/backend/api/Project';
import { Chat, WebsocketResponse } from 'src/model/backend/api/Ws';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { MessageForm } from 'src/model/Form';
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
  const methods = useForm<MessageForm>();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chats, setChats] = useState<GetProjectIdChatResponse>([]);

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

  const { readyState, sendJsonMessage } = useWebSocket('wss://dev.gotronmusic.com/socket', {
    queryParams: { userId },
    shouldReconnect: () => true,
    onMessage: ({ data }) => {
      const res: WebsocketResponse<Chat> = JSON.parse(data);
      if (res.a === 'chat') setChats([res.d, ...chats]);
    },
    // onOpen: () => console.log('open'),
    // onClose: () => console.log('close'),
    // onError: () => console.log('error'),
  });

  const onPublish = () => {
    publishProject(project.id)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onSend = (data: MessageForm) => {
    if (readyState !== 1) return;
    sendJsonMessage({
      action: 'chat',
      content: data.content,
      userId,
      projectId: project.id,
    });
    methods.reset();
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
            <Form
              methods={methods}
              onSubmit={onSend}
              className="border-[#707070] bg-white border border-solid rounded-2xl p-4 mt-10 mb-4"
            >
              <div className="mb-4 h-[150px] overflow-y-auto flex gap-3 flex-col-reverse">
                {chats.map((v, i) => (
                  <div key={i}>
                    <div className="text-grey text-xs">
                      {format(new Date(v.createdAt ?? ''), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                    <div className="flex-1 flex gap-3">
                      <div className="text-blue">{v.user?.username}</div>
                      <div className="whitespace-pre">{v.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <FormInput name="content" />
              <div className="text-right mt-4">
                <Button size="s" color="transparent" type="submit">
                  Send
                </Button>
              </div>
            </Form>
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
