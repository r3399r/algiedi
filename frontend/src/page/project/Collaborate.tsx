import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'src/component/Button';
import Form from 'src/component/Form';
import FormInput from 'src/component/FormInput';
import NotificationWidget from 'src/component/NotificationWidget';
import Tooltip from 'src/component/Tooltip';
import { Page } from 'src/constant/Page';
import { GetProjectIdChatResponse } from 'src/model/backend/api/Project';
import { Role } from 'src/model/backend/constant/Project';
import { DetailedProject } from 'src/model/backend/Project';
import { MessageForm } from 'src/model/Form';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { getChatsById, publishProject } from 'src/service/ProjectService';
import { wsSend } from 'src/util/wsTick';
import Activities from './Activities';
import CollaborateMaster from './CollaborateMaster';
import Info from './Info';
import ModalPublish from './ModalPublish';
import Partners from './Partners';
import Progress from './Progress';

type Props = {
  project: DetailedProject;
  doRefresh: () => void;
};

const Collaborate = ({ project, doRefresh }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const methods = useForm<MessageForm>();
  const { id: userId } = useSelector((root: RootState) => root.me);
  const { lastChat } = useSelector((root: RootState) => root.ws);
  const { isProjectInfoEdit } = useSelector((root: RootState) => root.ui);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [chats, setChats] = useState<GetProjectIdChatResponse>([]);

  const owner = useMemo(
    () => project.collaborators.find((v) => v.role === Role.Owner)?.user,
    [project],
  );

  const canPublish = useMemo(
    () =>
      project.collaborators.length === project.collaborators.filter((v) => v.isReady).length &&
      project.fileUrl !== null &&
      project.lyricsText !== null &&
      !isProjectInfoEdit,
    [project, isProjectInfoEdit],
  );

  useEffect(() => {
    getChatsById(project.id).then((res) => setChats(res));
  }, []);

  useEffect(() => {
    if (lastChat) setChats([lastChat, ...chats]);
  }, [lastChat]);

  const onPublish = () => {
    publishProject(project.id)
      .then(() => navigate(Page.Explore))
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onSend = (data: MessageForm) => {
    wsSend({
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
      <div className="mb-10 flex items-end justify-between">
        <div className="text-[20px] font-bold">Latest Project</div>
        <NotificationWidget />
      </div>
      <div className="rounded-xl bg-[#f2f2f2] p-5">
        <div className="flex gap-4">
          <div className="w-1/2">
            <Progress project={project} />
            <Info project={project} doRefresh={doRefresh} isOwner={owner.id === userId} />
            <CollaborateMaster project={project} doRefresh={doRefresh} />
            <Form
              methods={methods}
              onSubmit={onSend}
              className="mb-4 mt-10 rounded-2xl border border-solid border-[#707070] bg-white p-4"
            >
              <div className="mb-4 flex h-[150px] flex-col-reverse gap-3 overflow-y-auto">
                {chats.map((v, i) => (
                  <div key={i}>
                    <div className="text-xs text-grey">
                      {format(new Date(v.createdAt ?? ''), 'yyyy-MM-dd HH:mm:ss')}
                    </div>
                    <div className="flex flex-1 gap-3">
                      <div className="text-blue">{v.user?.username}</div>
                      <div className="whitespace-pre-line">{v.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <FormInput name="content" />
              <div className="mt-4 text-right">
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
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button onClick={() => setIsModalOpen(true)} disabled={!canPublish}>
              Publish
            </Button>
            <div>
              <Tooltip title="Please note that this step is irreversible" />
            </div>
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
