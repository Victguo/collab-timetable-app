import nextConnect from 'next-connect';
import middleware from '../../middleware/index';
import cookie from 'cookie';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res, next) => {
    req.session.destroy();
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
          path : '/'
    }));
    res.redirect('/');
});

export default handler;