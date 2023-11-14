import { Popover } from '@mui/material';
import classNames from 'classnames';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import { loadNotification } from 'src/service/NotificationService';
import Cover from './Cover';
import NotificationMessage from './NotificationMessage';

type Props = {
  className?: string;
};

const NotificationWidget = ({ className }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const { notifications } = useSelector((root: RootState) => root.api);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifications = useMemo(
    () => notifications?.filter((v) => v.isRead === false) ?? [],
    [notifications],
  );

  useEffect(() => {
    if (location.pathname !== Page.Notification && !notifications) loadNotification();
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (unreadNotifications.length > 0) setAnchorEl(event.currentTarget);
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
        {unreadNotifications.length}
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
          {unreadNotifications.map((v) => (
            <div key={v.id} className="m-2 flex items-center gap-2 rounded p-3">
              <Cover
                url={v.fromUser.avatarUrl}
                size={40}
                clickable
                onClick={() => navigate(`${Page.Explore}/user/${v.fromUserId}`)}
              />
              <NotificationMessage data={v} />
            </div>
          ))}
        </div>
      </Popover>
    </>
  );
};

export default NotificationWidget;
