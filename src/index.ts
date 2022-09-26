import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';

// utils fn's
const isPromise = <T>(payload: T) => {
  if ((payload && typeof payload === 'object' && 'then' in payload) || payload instanceof Promise) {
    return true;
  }
  return false;
};
const isResponse = <T extends {}>(obj: T) => Object.prototype.hasOwnProperty.call(obj, 'json');
const errorLogger = (message: string) => `Oops something went wrong ${message}`;

type PromiseStatesType = {
  FULFILLED: 'FULFILLED';
  REJECTED: 'REJECTED';
  PENDING: 'PENDING';
};

// promise state constants
export const { FULFILLED, REJECTED, PENDING }: PromiseStatesType = {
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
};

const reduxSimpleAsyncPayload: Middleware<Dispatch> =
  ({ dispatch }: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    try {
      if (isPromise(action.payload)) {
        const type = action.type;
        dispatch({
          type: `${type}_${PENDING}`,
        });

        (action.payload as Promise<any>)
          .then((a) => {
            if (isResponse(a)) {
              return a.json();
            }
            return a;
          })
          .then((data) => {
            dispatch({
              type: `${type}_${FULFILLED}`,
              payload: data,
            });
          })
          .catch((err) => {
            dispatch({
              type: `${type}_${REJECTED}`,
              payload: err,
            });
          });
      } else {
        next(action);
      }
    } catch (error) {
      errorLogger((error as Error).message);
      throw error;
    }
  };

export default reduxSimpleAsyncPayload;
