import nextConnect from 'next-connect';
import middleware from '../../middleware/index';


const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res, next) => {
    console.log(req.session.user || null);
    return res.json(req.session.user || {});
});

export default handler;