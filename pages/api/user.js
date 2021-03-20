import nextConnect from 'next-connect';
import middleware from '../../middleware/index';


const handler = nextConnect();
handler.use(middleware);

handler.get((req, res, next) => {
    return res.json(req.session.user || {});
});

export default handler;