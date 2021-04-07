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
            userID: userID,
            events: []
        }
        req.db.collection('timetables').insertOne(timetable, function (err, timetableDoc) {
            if (err) return res.status(500).end(err);
            req.db.collection('users').updateOne({email: req.user.email},{ $addToSet: {timetables : timetableDoc.ops[0]._id }},
                function(err, updatedUser) {
                    if (err) return res.status(500).end(err);
                    pusher.trigger('timetable-channel', 'timetable-change', user);
                    return res.json({email: updatedUser.email, timetables: updatedUser.timetables});
            });
        });
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
        req.db.collection('timetables').findOneAndDelete({_id: ObjectID(req.body.tableID)}, function (err, docs) {
            if (err) return res.status(500).end(err);
            req.db.collection('users').updateMany({ timetables: ObjectID(req.body.tableID) }, { $pull: { timetables: ObjectID(req.body.tableID)}},
                function (err, userDocs) {
                    if (err) return res.status(500).end(err);
                    pusher.trigger('timetable-channel', 'timetable-change', user);
                    return res.json(docs);
                });
        });   
    }
})

export default handler;
