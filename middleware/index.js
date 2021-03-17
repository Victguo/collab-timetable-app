import nextConnect from 'next-connect';
import database from './mongodb';
import {sessionMiddleware, setSession} from './session';

const middleware = nextConnect();

middleware.use(database).use(sessionMiddleware).use(setSession);

export default middleware;