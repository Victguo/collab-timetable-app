import session from 'express-session';
import cookie from 'cookie';
// import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);

// There is a known error attempting to use later versions of connect-mongo, solution says to downgrade version
export function sessionMiddleware(req, res, next) {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  });
  return session({
    secret: process.env.SESSION_SECRET,
    cookie: { secure: false },
    store: mongoStore,
    resave: false,
    saveUninitialized: true,
  })(req, res, next);
}

export function setSession(req, res, next) {
    req.user = ('user' in req.session)? req.session.user : null;
    let userEmail = (req.user)? req.user.email : '';
    res.setHeader('Set-Cookie', cookie.serialize('username', userEmail, {
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    console.log("HTTP request", req.user, req.method, req.url, req.body);
    next();
}