import nextConnect from 'next-connect';
import middleware from '../../middleware/index';
import cookie from 'cookie';
import { ObjectID } from 'bson';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    const tableID = req.body.tableID;
    const title = req.body.title;
    const start = req.body.start;
    const end = req.body.end;
    const description = req.body.description;

    if (!title) {
        return res.status(400).send("Please enter an event title");
    }
    if (!tableID) {
        return res.status(400).send("Please select a timetable for this event");
    }
    if (!start || !end) {
        return res.status(400).send("Please enter a date");
    }

    // check to see if user is signed in

    let event = {
        title: title,
        tableID: tableID,
        start: start,
        end: end,
        description: description
    }
    
    const result = await req.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID)}, {$push: {events: event}});

    return res.json({result});
});

handler.delete(async (req, res) => {
    
    // add authentication check here

    const result = await req.db.collection('timetables').findOneAndDelete({_id: ObjectID(req.body.tableID)}, function(err, table){
        if (err) return res.status(500).end(err);
        if (!table) return res.status(404).end("Timetable does not exist");

    });

    return res.json(result);
})

export default handler;
