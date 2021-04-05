import nextConnect from 'next-connect';
import database from './mongodb';
import {sessionMiddleware, setSession} from './session';
import Pusher from 'pusher';

const middleware = nextConnect();

middleware.use(database).use(sessionMiddleware).use(setSession);

export const pusher = new Pusher({
  appId: "1180727",
  key: "3d233baf43924a505592",
  secret: "da4e9306b25ed68c4970",
  cluster: "us2",
  useTLS: true
});

export default middleware;