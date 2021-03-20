import nextConnect from 'next-connect';
import middleware from '../../middleware/index';
import cookie from 'cookie';
import { ObjectID } from 'bson';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    const title = req.body.title;
    const owner = req.body.owner;
    if (!title) {
        return res.status(400).send("Please enter a title for the timetable");
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
    const timetables = await req.db.collection('timetables').find({}).sort({_id: -1}).toArray();

    res.send(timetables);
})

handler.delete(async (req, res) => {
    
    const result = await req.db.collection('timetables').findOneAndDelete({_id: ObjectID(req.body.tableID)}, function(err, table){
        if (err) return res.status(500).end(err);
        if (!table) return res.status(404).end("Timetable does not exist");

    });

    return res.json(result);
})

export default handler;
