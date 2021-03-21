import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';
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
    const user = req.user.email;

    if (!title) {
        return res.status(400).send("Please enter an event title");
    }
    if (!tableID) {
        return res.status(400).send("Please select a timetable for this event");
    }
    if (!start || !end) {
        return res.status(400).send("Please enter a date");
    }

    // check to see if signed in user is timetable owner
    const timetable = await req.db.collection('timetables').findOne({_id: ObjectID(tableID)});

    if (timetable.userID != user) {
        res.status(401).end("access denied");
    }
    else {
        let event = {
            title: title,
            tableID: tableID,
            start: start,
            end: end,
            description: description
        }
        
        const result = await req.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID)}, {$push: {events: event}});
    
        return res.json({result});
    }
});

handler.delete(async (req, res) => {
    
    // add authentication check here
    const tableID = req.body.tableID;
    const event = req.body.event;
    const user = req.user.email;

    if (!tableID || !event){
        return res.status(400).send("Missing input");
    }

    // check to see if signed in user is timetable owner
    const timetable = await req.db.collection('timetables').findOne({_id: ObjectID(tableID)});

    if (timetable.userID != user) {
        res.status(401).end("access denied");
    }
    else {
        const result = await req.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID)}, {$pull: {events: event}} );

        return res.json(result);
    }
})

handler.patch(async (req, res) => {
    
    // add authentication check here
    const tableID = req.body.tableID;
    const oldEvent = req.body.oldEvent;
    const newEvent = req.body.newEvent;
    const user = req.user.email;

    if (!tableID || !oldEvent || !newEvent){
        return res.status(400).send("Missing input");
    }

    // check to see if signed in user is timetable owner
    const timetable = await req.db.collection('timetables').findOne({_id: ObjectID(tableID)});

    if (timetable.userID != user) {
        res.status(401).end("access denied");
    }
    else {

        const result = await req.db.collection('timetables').updateOne({_id: ObjectID(tableID), "events.title": oldEvent.title, "events.start": oldEvent.start, "events.end": oldEvent.end, "events.description": oldEvent.description}, {$set: {"events.$": newEvent}});

        return res.json(result);
    }
})


export default handler;
