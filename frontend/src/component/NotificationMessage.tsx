import { DetailedNotification } from 'src/model/backend/api/Notification';
import { NotificationType } from 'src/model/backend/constant/Notification';

type Props = { data: DetailedNotification };

const NotificationMessage = ({ data }: Props) => {
  const TargetButton = () => <span className="font-bold text-blue">{data.target?.info.name}</span>;

  const UserButton = () => <span className="font-bold text-blue">{data.fromUser.username}</span>;

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
    case NotificationType.FolloweeUploaded:
      return (
        <div>
          A new creation <TargetButton /> was just uploaded by <UserButton />
        </div>
      );
  }
};

export default NotificationMessage;
