import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';
import cookie from 'cookie';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {

    const {userID} = req.query;
    const user = req.user.email;

    if (!userID) {
        return res.status(400).send("Please enter a userID");
    }

    if (user && user == userID) {

        const timetables = await req.db.collection('timetables').find({userID: userID}).sort({_id: -1}).toArray();
        res.send(timetables);

    } else {
        res.status(401).end("access denied");
    }
})



export default handler;
