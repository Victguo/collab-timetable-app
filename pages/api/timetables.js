import nextConnect from 'next-connect';
import middleware from '../../middleware/index';
import cookie from 'cookie';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    console.log("test");
    const title = req.body.title;
    const owner = req.body.owner;
    if (!title) {
        return res.status(400).send("Please enter an event title");
    }

    // check to see if user is signed in

    let timetable = {
        title: title,
        // change to user after
        owner: owner,
        events: []
    }
    const result = await req.db.collection('timetables').insertOne(timetable).then(({ ops }) => ops[0]);

    return res.json({result});
});

handler.get(async (req, res) => {
    const timetables = await req.db.collection('timetables').find({}).sort({createdAt: -1}).toArray();

    res.send(timetables);
})

export default handler;