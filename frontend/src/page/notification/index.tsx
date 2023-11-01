import { formatDistanceToNow } from 'date-fns';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { DetailedNotification } from 'src/model/backend/api/Notification';
import { NotificationType } from 'src/model/backend/constant/Notification';
import { Status } from 'src/model/backend/constant/Project';
import { RootState } from 'src/redux/store';
import { loadNotification, readNotification } from 'src/service/NotificationService';

const MessageComponent = ({
  type,
  creationName,
  userName,
}: {
  type: NotificationType;
  creationName: string;
  userName: string;
}) => {
  switch (type) {
    case NotificationType.ProjectStart:
      return (
        <div>
          The project <b>{creationName}</b> has been started
        </div>
      );
    case NotificationType.ProjectReject:
      return (
        <div>
          You were rejected from the project <b>{creationName}</b>
        </div>
      );
    case NotificationType.ProjectPublish:
      return (
        <div>
          The project <b>{creationName}</b> has been published
        </div>
      );
    case NotificationType.ProjectUpdated:
      return (
        <div>
          The project <b>{creationName}</b> has been updated by <b>{userName}</b>
        </div>
      );
    case NotificationType.CreationUpdated:
      return (
        <div>
          A creation of the project <b>{creationName}</b> has been updated by <b>{userName}</b>
        </div>
      );
    case NotificationType.CreationUploaded:
      return (
        <div>
          A participant <b>{userName}</b> has uploaded a creation to the project{' '}
          <b>{creationName}</b>
        </div>
      );
    case NotificationType.NewParticipant:
      return (
        <div>
          A new participant <b>{userName}</b> has joined the project <b>{creationName}</b>
        </div>
      );
    case NotificationType.InspiredApproved:
      return (
        <div>
          Your inspiration has been approved in the project <b>{creationName}</b>
        </div>
      );
    case NotificationType.InspiredUnapproved:
      return (
        <div>
          Your inspiration has been unapproved in the project <b>{creationName}</b>
        </div>
      );
    case NotificationType.PartnerReady:
      return (
        <div>
          A partner <b>{userName}</b> has set the project <b>{creationName}</b> as ready
        </div>
      );
    case NotificationType.PartnerNotReady:
      return (
        <div>
          A partner <b>{userName}</b> thought that the project <b>{creationName}</b> needs more work
        </div>
      );
    case NotificationType.Follow:
      return (
        <div>
          You have been followed by <b>{userName}</b>
        </div>
      );
    case NotificationType.Like:
      return (
        <div>
          Your creation <b>{creationName}</b> has been liked by <b>{userName}</b>
        </div>
      );
    case NotificationType.Comment:
      return (
        <div>
          Your creation <b>{creationName}</b> has been commented by <b>{userName}</b>
        </div>
      );
  }
};

const Notification = () => {
  const { notifications } = useSelector((root: RootState) => root.api);
  const navigate = useNavigate();

  useEffect(() => {
    if (!notifications) loadNotification();
  }, []);

  const onClick = (data: DetailedNotification) => () => {
    if (!data.isRead) readNotification(data.id);
    if (data.type === NotificationType.ProjectPublish) navigate(`${Page.Explore}/${data.targetId}`);
    else if (
      [
        NotificationType.ProjectStart,
        NotificationType.ProjectUpdated,
        NotificationType.CreationUpdated,
        NotificationType.CreationUploaded,
        NotificationType.NewParticipant,
        NotificationType.InspiredApproved,
        NotificationType.InspiredUnapproved,
        NotificationType.PartnerReady,
        NotificationType.PartnerNotReady,
      ].includes(data.type)
    )
      if (data.target?.project?.status === Status.Published)
        navigate(`${Page.Explore}/${data.targetId}`);
      else navigate(`${Page.Project}`, { state: { id: data.targetId } });
    else if ([NotificationType.Like, NotificationType.Comment].includes(data.type))
      navigate(`${Page.Explore}/${data.targetId}`);
    else if (data.type === NotificationType.Follow)
      navigate(`${Page.Explore}/user/${data.fromUserId}`);
  };

  return (
    <div className="relative">
      <NotificationWidget className="absolute right-0 top-0" />
      <div className="text-[20px] font-bold">Notifications</div>
      <div className="mt-5 flex flex-col gap-4">
        {(notifications ?? []).map((v) => (
          <div
            key={v.id}
            className="relative flex cursor-pointer items-center rounded bg-white p-4"
            onClick={onClick(v)}
          >
            {!v.isRead && (
              <div className="absolute left-5 top-1/2 h-[5px] w-[5px] rounded-full bg-blue" />
            )}
            <Cover url={v.fromUser.avatarUrl} size={80} />
            <div className="pl-5">
              <MessageComponent
                type={v.type}
                creationName={v.target?.info.name ?? ''}
                userName={v.fromUser.username}
              />
            </div>
            <div className="absolute bottom-5 right-5 text-right text-sm text-grey">
              {v.createdAt ? formatDistanceToNow(new Date(v.createdAt)) : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
