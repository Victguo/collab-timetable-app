import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import middleware from '../../middleware/index';
import cookie from 'cookie';
import {generateHash} from '../../utils/auth';


const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    const {email, password} = req.body;
    if (!isEmail(email)) {
        return res.status(400).send('The email is invalid');
    }

    req.db.collection('users').findOne({email: email}, function(err, user) {
        if (err) return res.status(500).end(err);
        if (!user) return res.status(401).end("This login is not valid");
        if (user.password !== generateHash(password, user.salt)) return res.status(401).end("This login is not valid");

        req.session.user = {email: user.email};
        res.setHeader('Set-Cookie', cookie.serialize('username', user.email, {
            path : '/'
        }));
        return res.json({email : user.email});
    });
});

export default handler;