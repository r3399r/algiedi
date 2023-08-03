import { Popover } from '@mui/material';
import classNames from 'classnames';
import { MouseEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Notification as NotificationType } from 'src/model/backend/entity/NotificationEntity';
import { RootState } from 'src/redux/store';
import { getNotification } from 'src/service/NotificationService';

type Props = {
  className?: string;
};

const NotificationWidget = ({ className }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [notification, setNotification] = useState<NotificationType[]>([]);
  const { lastNotification } = useSelector((root: RootState) => root.ws);

  useEffect(() => {
    getNotification().then((res) => setNotification(res));
  }, []);

  useEffect(() => {
    if (lastNotification) setNotification([lastNotification, ...notification]);
  }, [lastNotification]);

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
        {notification.length}
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
        <div className="px-2 pt-2">Notifications</div>
        <div className="flex flex-col gap-2">
          {notification.map((v) => (
            <div key={v.id} className="relative m-2 cursor-pointer rounded bg-grey/30 p-3">
              {!v.isRead && (
                <div className="absolute left-5 top-1/2 h-[5px] w-[5px] rounded-full bg-red" />
              )}
              <div className="pl-5">{v.type}</div>
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default NotificationWidget;