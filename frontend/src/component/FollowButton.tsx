import { MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { openFailSnackbar } from 'src/redux/uiSlice';
import { followByUserId, unfollowByUserId } from 'src/service/ExploreService';
import Button from './Button';

type Props = {
  id: string;
  following: boolean | null;
  doRefresh: () => void;
};

const FollowButton = ({ id, following, doRefresh }: Props) => {
  const {
    ui: { isLogin },
    me,
  } = useSelector((rootState: RootState) => rootState);
  const dispatch = useDispatch();

  const onFollow = (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    followByUserId(id)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  const onUnfollow = (e: MouseEvent<HTMLOrSVGElement>) => {
    e.stopPropagation();
    unfollowByUserId(id)
      .then(doRefresh)
      .catch((err) => dispatch(openFailSnackbar(err)));
  };

  return (
    <div>
      {isLogin && me.id !== id ? (
        following ? (
          <Button size="s" onClick={onUnfollow}>
            Unfollow
          </Button>
        ) : (
          <Button size="s" onClick={onFollow}>
            Follow
          </Button>
        )
      ) : (
        <Button size="s" disabled>
          Follow
        </Button>
      )}
    </div>
  );
};

export default FollowButton;
