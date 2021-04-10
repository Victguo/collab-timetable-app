import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';
import cookie from 'cookie';
import { ObjectID } from 'bson';

const handler = nextConnect();
handler.use(middleware);

handler.get(async (req, res) => {

    const {tableID} = req.query;

    if (!tableID) {
        return res.status(400).send("Please select the timetable this event belongs to");
    }
    const timetable = await req.db.collection('timetables').findOne({_id: ObjectID(tableID)});

    if (!timetable) {
        return res.status(404).send("Timetable not found");
    }
    else {
        res.send(timetable.events);
    }
})

export default handler;
