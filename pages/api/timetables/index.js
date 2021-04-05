import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';
import { ObjectID } from 'bson';
import { pusher } from '../../../middleware/index';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    const title = req.body.title;
    const userID = req.body.userID;
    const user = req.user.email;

    if (!title) {
        return res.status(400).send("Please enter a title for the timetable");
    }

    // check to see if user is signed in
    if (user && user == userID) {
        let timetable = {
            title: title,
            // change to user after
            userID: userID,
            events: []
        }
        const result = await req.db.collection('timetables').insertOne(timetable).then(({ ops }) => ops[0]);
        pusher.trigger('timetable-channel', 'new-timetable', []);
        return res.json({result});
    }
    else {
        res.status(401).end("access denied");
    }
});

handler.delete(async (req, res) => {
    
    const user = req.user.email;

    const table = await req.db.collection('timetables').findOne({_id: ObjectID(req.body.tableID)});
    if (!table) return res.status(404).end("Timetable does not exist");

    if (table.userID != user){
        res.status(401).end("only timetable owner can delete");
    } 
    else {
        const result = await req.db.collection('timetables').findOneAndDelete({_id: ObjectID(req.body.tableID)});
    
        return res.json(result);
    }
})

export default handler;
