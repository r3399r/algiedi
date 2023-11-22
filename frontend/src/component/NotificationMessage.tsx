import { useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { DetailedNotification } from 'src/model/backend/api/Notification';
import { NotificationType } from 'src/model/backend/constant/Notification';
import { Status } from 'src/model/backend/constant/Project';
import { readNotification } from 'src/service/NotificationService';

type Props = { data: DetailedNotification };

const NotificationMessage = ({ data }: Props) => {
  const navigate = useNavigate();

  const onClickCreation = () => {
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
      else navigate(Page.Project, { state: { id: data.targetId } });
    else if ([NotificationType.Like, NotificationType.Comment].includes(data.type))
      navigate(`${Page.Explore}/${data.targetId}`);
    else if (data.type === NotificationType.Follow)
      navigate(`${Page.Explore}/user/${data.fromUserId}`);
  };

  const TargetButton = () => (
    <span
      className="cursor-pointer font-bold text-blue hover:underline"
      onClick={() => {
        if (!data.isRead) readNotification(data.id);
        onClickCreation();
      }}
    >
      {data.target?.info.name}
    </span>
  );

  const UserButton = () => (
    <span
      className="cursor-pointer font-bold text-blue hover:underline"
      onClick={() => {
        if (!data.isRead) readNotification(data.id);
        navigate(`${Page.Explore}/user/${data.fromUserId}`);
      }}
    >
      {data.fromUser.username}
    </span>
  );

  switch (data.type) {
    case NotificationType.ProjectStart:
      return (
        <div>
          The project <TargetButton /> has been started
        </div>
      );
    case NotificationType.ProjectReject:
      return (
        <div>
          You were rejected from the project <TargetButton />
        </div>
      );
    case NotificationType.ProjectPublish:
      return (
        <div>
          The project <TargetButton /> has been published
        </div>
      );
    case NotificationType.ProjectUpdated:
      return (
        <div>
          The project <TargetButton /> has been updated by <UserButton />
        </div>
      );
    case NotificationType.CreationUpdated:
      return (
        <div>
          A creation of the project <TargetButton /> has been updated by <UserButton />
        </div>
      );
    case NotificationType.CreationUploaded:
      return (
        <div>
          A participant <UserButton /> has uploaded a creation to the project <TargetButton />
        </div>
      );
    case NotificationType.NewParticipant:
      return (
        <div>
          A new participant <UserButton /> has joined the project <TargetButton />
        </div>
      );
    case NotificationType.InspiredApproved:
      return (
        <div>
          Your inspiration has been approved in the project <TargetButton />
        </div>
      );
    case NotificationType.InspiredUnapproved:
      return (
        <div>
          Your inspiration has been unapproved in the project <TargetButton />
        </div>
      );
    case NotificationType.PartnerReady:
      return (
        <div>
          A partner <UserButton /> has set the project <TargetButton /> as ready
        </div>
      );
    case NotificationType.PartnerNotReady:
      return (
        <div>
          A partner <UserButton /> thought that the project <TargetButton /> needs more work
        </div>
      );
    case NotificationType.Follow:
      return (
        <div>
          You have been followed by <UserButton />
        </div>
      );
    case NotificationType.Like:
      return (
        <div>
          Your creation <TargetButton /> has been liked by <UserButton />
        </div>
      );
    case NotificationType.Comment:
      return (
        <div>
          Your creation <TargetButton /> has been commented by <UserButton />
        </div>
      );
  }
};

export default NotificationMessage;
