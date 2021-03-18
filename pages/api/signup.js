import nextConnect from 'next-connect';
import isEmail from 'validator/lib/isEmail';
import crypto from 'crypto';
import middleware from '../../middleware/index';
import cookie from 'cookie';

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
        path : '/', 
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    return res.json({email : user.email});
});

function generateSalt (){
    return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

export default handler;