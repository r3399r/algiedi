import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { formatDistanceToNow } from 'date-fns';
import { MouseEvent, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cover from 'src/component/Cover';
import NotificationMessage from 'src/component/NotificationMessage';
import NotificationWidget from 'src/component/NotificationWidget';
import { Page } from 'src/constant/Page';
import { RootState } from 'src/redux/store';
import {
  deleteNotification,
  getNavigateTo,
  loadNotification,
  readNotification,
} from 'src/service/NotificationService';

const Notification = () => {
  const navigate = useNavigate();
  const { notifications } = useSelector((root: RootState) => root.api);

  useEffect(() => {
    loadNotification();
  }, []);

  return (
    <div className="relative">
      <div className="flex items-end justify-between">
        <div className="text-[20px] font-bold">Notifications</div>
        <NotificationWidget />
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {(notifications ?? []).map((v) => (
          <div
            key={v.id}
            className="relative flex cursor-pointer items-center rounded bg-white p-4"
            onClick={() => {
              if (!v.isRead) readNotification(v.id);
              const to = getNavigateTo(v);
              navigate(to, to === Page.Project ? { state: { id: v.targetId } } : undefined);
            }}
          >
            {!v.isRead && (
              <div
                className="absolute left-3 top-3 h-[15px] w-[15px] cursor-pointer rounded-full bg-blue"
                onClick={() => readNotification(v.id)}
              />
            )}
            <Cover
              url={v.fromUser.avatarUrl}
              size={80}
              clickable
              onClick={() => {
                if (!v.isRead) readNotification(v.id);
                navigate(`${Page.Explore}/user/${v.fromUserId}`);
              }}
              type="user"
            />
            <div className="pl-5">
              <NotificationMessage data={v} />
            </div>
            <div
              className="absolute right-5 top-5 cursor-pointer"
              onClick={(e: MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                deleteNotification(v.id);
              }}
            >
              <RemoveCircleOutlineIcon />
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
