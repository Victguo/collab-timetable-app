import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';
import {ObjectId} from 'mongodb';
import cookie from 'cookie';


const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {

    const {tableID} = req.body;

    if(!req.user) return res.status(401).end('access denied');

    req.db.collection('timetables').findOne({_id: ObjectId(tableID)}, function(err, timetable) {
        if (err) return res.status(500).end(err);
        console.log(timetable);
        if (!timetable) return res.status(401).end("This timetable does not exist");
        req.db.collection('timetableInvites').findOne({tableID}, function(err, existingInvite) {
            if (err) return res.status(500).end(err);
            if (existingInvite) {
                return res.json(existingInvite);
            } else {
                req.db.collection('timetableInvites').insertOne({tableID: tableID, owner: req.user.email}, function(err, timetableInvite) {
                    if (err) return res.status(500).end(err);
                    return res.json(timetableInvite);
                });
            }
        });
    });
});
export default handler;