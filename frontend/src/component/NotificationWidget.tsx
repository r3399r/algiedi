import { Popover } from '@mui/material';
import classNames from 'classnames';
import { MouseEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { NotificationType } from 'src/model/backend/constant/Notification';
import { RootState } from 'src/redux/store';
import { loadNotification } from 'src/service/NotificationService';
import Cover from './Cover';

type Props = {
  className?: string;
};

const NotificationWidget = ({ className }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { notifications } = useSelector((root: RootState) => root.api);
  const location = useLocation();
  const navigate = useNavigate();

  const getText = (type: NotificationType, name: string, username: string) => {
    switch (type) {
      case NotificationType.ProjectStart:
        return `The project ${name} has been started`;
      case NotificationType.ProjectReject:
        return `You were rejected from the project ${name}`;
      case NotificationType.ProjectPublish:
        return `The project ${name} has been published`;
      case NotificationType.ProjectUpdated:
        return `The project ${name} has been updated by ${username}`;
      case NotificationType.CreationUpdated:
        return `A creation of the project ${name} has been updated by ${username}`;
      case NotificationType.CreationUploaded:
        return `A participant ${username} has uploaded a creation to the project ${name}`;
      case NotificationType.NewParticipant:
        return `A new participant ${username} has joined the project ${name}`;
      case NotificationType.InspiredApproved:
        return `Your inspiration has been approved in the project ${name}`;
      case NotificationType.InspiredUnapproved:
        return `Your inspiration has been unapproved in the project ${name}`;
      case NotificationType.PartnerReady:
        return `A partner ${username} has set the project ${name} as ready`;
      case NotificationType.PartnerNotReady:
        return `A partner ${username} thought that the project ${name} needs more work`;
      case NotificationType.Follow:
        return `You have been followed by ${username}`;
      case NotificationType.Like:
        return `Your creation ${name} has been liked by ${username}`;
      case NotificationType.Comment:
        return `Your creation ${name} has been commented by ${username}`;
    }
  };

  useEffect(() => {
    if (location.pathname !== Page.Notification && !notifications) loadNotification();
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className={classNames(
          'flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-xl bg-red font-bold text-white shadow-lg',
          className,
        )}
        onClick={handleClick}
      >
        {(notifications ?? []).filter((v) => !v.isRead).length}
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className="flex flex-col gap-2">
          {(notifications ?? [])
            .filter((v) => !v.isRead)
            .map((v) => (
              <div
                key={v.id}
                className="m-2 flex cursor-pointer items-center gap-2 rounded p-3"
                onClick={() => navigate(Page.Notification)}
              >
                <Cover url={v.fromUser.avatarUrl} size={40} clickable />
                <div>{getText(v.type, v.target?.info.name ?? '', v.fromUser.username)}</div>
              </div>
            ))}
        </div>
      </Popover>
    </>
  );
};

export default NotificationWidget;
