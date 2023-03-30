import { setMe } from 'src/redux/meSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { getUserAttributes } from './AuthService';

export const init = async () => {
  try {
    dispatch(startWaiting());
    const userAttributes = await getUserAttributes();
    const res: { [key: string]: string } = {};
    userAttributes.forEach((v) => {
      res[v.name] = v.value;
    });
    dispatch(
      setMe({
        sub: res.sub,
        firstName: res['custom:first_name'],
        lastName: res['custom:last_name'],
        bio: res['custom:bio'],
        emailVerified: Boolean(res.email_verified),
        language: res['custom:language'].split(','),
        role: res['custom:role'].split(','),
        email: res.email,
        age: res['custom:age'],
      }),
    );
  } finally {
    dispatch(finishWaiting());
  }
};
