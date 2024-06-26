import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import UploadIcon from '@mui/icons-material/Upload';
import { Popover } from '@mui/material';
import classNames from 'classnames';
import { formatDistanceToNow } from 'date-fns';
import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import {
  deleteNotification,
  getNavigateTo,
  loadNotification,
  readNotification,
} from 'src/service/NotificationService';
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
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div className="flex gap-2">
        <div
          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-xl bg-blue shadow-lg"
          onClick={() => navigate(Page.Upload)}
        >
          <UploadIcon className="text-white" />
        </div>
        <div
          className={classNames(
            'flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-xl bg-red font-bold text-white shadow-lg',
            className,
          )}
          onClick={handleClick}
        >
          {unreadNotifications.length}
        </div>
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
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((v) => (
              <div
                key={v.id}
                className="m-2 flex cursor-pointer items-center gap-2 rounded p-3"
                onClick={() => {
                  if (!v.isRead) readNotification(v.id);
                  const to = getNavigateTo(v);
                  navigate(to, to === Page.Project ? { state: { id: v.targetId } } : undefined);
                }}
              >
                <Cover
                  url={v.fromUser.avatarUrl}
                  size={50}
                  clickable
                  onClick={() => {
                    if (!v.isRead) readNotification(v.id);
                    navigate(`${Page.Explore}/user/${v.fromUserId}`);
                  }}
                  type="user"
                />
                <div className="flex-1">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <NotificationMessage data={v} />
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={(e: MouseEvent<HTMLDivElement>) => {
                        e.stopPropagation();
                        deleteNotification(v.id);
                      }}
                    >
                      <RemoveCircleOutlineIcon />
                    </div>
                  </div>
                  <div className="text-right text-sm text-grey">
                    {v.createdAt ? formatDistanceToNow(new Date(v.createdAt)) : ''}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="m-2 p-3">You do not have unread message</div>
          )}
        </div>
      </Popover>
    </>
  );
};

export default NotificationWidget;
