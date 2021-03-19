import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import middleware from '../../middleware/index';
import cookie from 'cookie';
import {generateHash, generateSalt} from '../../utils/auth';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    const {email, password} = req.body;
    if (!isEmail(email)) {
        return res.status(400).send('The email is invalid');
    }

    if ((await req.db.collection('users').countDocuments({ email: email })) > 0) {
        return res.status(403).send('This email is already being used');
    }

    var salt = generateSalt();
    var hash = generateHash(password, salt);

    const user = await req.db.collection('users').insertOne({
        email: email,
        password: hash,
        salt: salt
    }).then(({ ops }) => ops[0]);
    req.session.user = {email : user.email};

    res.setHeader('Set-Cookie', cookie.serialize('username', user.email, {
        path : '/'
    }));
    return res.json({email : user.email});
});

export default handler;