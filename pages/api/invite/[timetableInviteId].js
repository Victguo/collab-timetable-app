import nextConnect from 'next-connect';
import middleware from '../../../middleware/index';

import {ObjectId} from 'mongodb'

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res, next) => {
    //TODO: Do auth check
    const {timetableInviteId} = req.query;
    if(!req.user) return res.status(401).end('access denied');
    req.db.collection('timetableInvites').findOne({_id: ObjectId(timetableInviteId)}, function(err, timetableInvite) {
        if (err) return res.status(500).end(err);
        if (!timetableInvite) return res.status(401).end("This invite is invalid");
        // TODO: Add this timetable to the user
        req.db.collection('users').updateOne({email: req.user.email},{ $addToSet: {sharedTimetables : ObjectId(timetableInvite.tableID) }},
            function(err, updatedUser) {
                if (err) return res.status(500).end(err);
                return res.json({email: updatedUser.email})
        });
    });
});


export default handler;