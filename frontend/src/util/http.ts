import axios, { AxiosError, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import { dispatch } from 'src/redux/store';
import { setIsLogin } from 'src/redux/uiSlice';
import { emitter } from './eventBus';

// eslint-disable-next-line
type Options<D = any, P = any> = {
  headers?: RawAxiosRequestHeaders;
  data?: D;
  params?: P;
};

const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api/',
  timeout: 30000,
};

const defaultHeader: RawAxiosRequestHeaders = {
  'Content-type': 'application/json',
  Accept: 'application/json',
};

// eslint-disable-next-line
const publicRequestConfig = <D = unknown, P = any>(
  method: string,
  url: string,
  options?: Options<D, P>,
) => ({
  ...defaultConfig,
  headers: {
    ...defaultHeader,
    ...options?.headers,
  },
  data: options?.data,
  params: options?.params,
  url,
  method,
});

// eslint-disable-next-line
const privateRequestConfig = <D = unknown, P = any>(
  method: string,
  url: string,
  options?: Options<D, P>,
) => ({
  ...defaultConfig,
  headers: {
    ...defaultHeader,
    ...options?.headers,
    ...({ Authorization: localStorage.getItem('token') ?? '' } as RawAxiosRequestHeaders),
  },
  data: options?.data,
  params: options?.params,
  url,
  method,
});

// eslint-disable-next-line
const publicRequest = async <T, D = unknown, P = any>(
  method: string,
  url: string,
  options?: Options<D, P>,
) => {
  try {
    return await axios.request<T>(publicRequestConfig<unknown, P>(method, url, options));
  } catch (e) {
    // eslint-disable-next-line
    const error = e as AxiosError<any>;
    throw error.response?.data.message;
  }
};

// eslint-disable-next-line
const authRequest = async <T, D = unknown, P = any>(
  method: string,
  url: string,
  options?: Options<D, P>,
) => {
  try {
    return await axios.request<T>(privateRequestConfig<unknown, P>(method, url, options));
  } catch (e) {
    // eslint-disable-next-line
    const error = e as AxiosError<any>;
    if (
      error.response?.status === 401 &&
      error.response.data.message === 'The incoming token has expired'
    ) {
      localStorage.removeItem('token');
      dispatch(setIsLogin(false));
      emitter.emit('auth-expired');
    }
    throw error.response?.data.message;
  }
};

// eslint-disable-next-line
const get = async <T, P = any>(url: string, options?: Options<any, P>) =>
  await publicRequest<T, unknown, P>('get', url, options);

const post = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await publicRequest<T, D>('post', url, options);

const put = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await publicRequest<T, D>('put', url, options);

const patch = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await publicRequest<T, D>('patch', url, options);

const sendDelete = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await publicRequest<T, D>('delete', url, options);

// eslint-disable-next-line
const authGet = async <T, P = any>(url: string, options?: Options<any, P>) =>
  await authRequest<T, unknown, P>('get', url, options);

const authPost = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await authRequest<T, D>('post', url, options);

const authPut = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await authRequest<T, D>('put', url, options);

const authPatch = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await authRequest<T, D>('patch', url, options);

const authDelete = async <T, D = unknown>(url: string, options?: Options<D>) =>
  await authRequest<T, D>('delete', url, options);

export default {
  get,
  post,
  put,
  patch,
  delete: sendDelete,
  authGet,
  authPost,
  authPut,
  authPatch,
  authDelete,
};
