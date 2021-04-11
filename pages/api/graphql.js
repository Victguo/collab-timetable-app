import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb'
import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectId, ObjectID } from 'bson';
import isEmail from 'validator/lib/isEmail';
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { generateHash, generateSalt } from '../../utils/auth';
import { pusher } from '../../middleware/index';

const { MONGODB_URI, MONGODB_DB } = process.env

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

const typeDefs = gql`

    scalar Date

    input EventInput {
        title: String
        tableID: String
        start: Date
        end: Date
        description: String
    }

    input TimetableInput {
        _id: ID
        title: String
        userID: String
        events: [EventInput]
    }

    type User {
        _id: ID
        email: String
        password: String
        salt: String
        timetables: [String]
        sharedTimetables: [String]
    }
    type Token {
        value: String
    }
    type Timetable {
        _id: ID
        title: String
        userID: String
        events: [Event]
    }
    type Event {
        title: String
        tableID: String
        start: Date
        end: Date
        description: String
    }

    type Invite {
        _id: String
        owner: String
        tableID: String
    }

    type Query {
        user: User
        timetables: [Timetable]
        sharedTimetables: [Timetable]
        events(tableID: String!): [Event]
    }

    type Mutation {
        register(email: String!, password: String!): Token
        login(email: String!, password: String!): Token
        signout: Boolean
        createTimetable(title: String!): Timetable
        deleteTimetable(tableID: String!): Timetable
        createInvite(tableID: String!): Invite
        inviteUser(inviteID: String!): Boolean
        createEvent(tableID: String!, title: String!, start: Date!, end: Date!, description: String, sharedTimetables: [TimetableInput]): Timetable
        deleteEvent(tableID: String!, event: EventInput, sharedTimetables: [TimetableInput]): Timetable
        updateEvent(tableID: String!, oldEvent: EventInput, newEvent: EventInput, sharedTimetables: [TimetableInput]): Timetable
    }
`

const resolvers = {
    Query: {
        user(_parent, _args, _context, _info) {
            if(_context.user && _context.user.id) {
                return _context.db
                .collection('users')
                .findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data
                });
            } else {
                return null;
            }
            
        },
        async timetables(_parent, _args, _context, _info) {
            if(_context.user && _context.user.id) {
                const user = await _context.db.collection('users')
                .findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                const timetableArray = await _context.db.collection('timetables').find({_id: {$in: user.timetables}}).sort({_id: -1}).toArray();
                return timetableArray;
            } else {
                return null;
            }
            
        },
        
        async sharedTimetables(_parent, _args, _context, _info) {
            if(_context.user && _context.user.id) {
                const user = await _context.db.collection('users')
                .findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                const timetableArray = await _context.db.collection('timetables').find({_id: {$in: user.sharedTimetables}}).sort({_id: -1}).toArray();
                return timetableArray;
            } else {
                return null;
            }
        },

        async events(_parent, {tableID}, _context, _info) {

            if(_context.user && _context.user.id) {

                const timetable = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
            
                if (!timetable) {
                    throw new Error("Timetable not found");
                }
                else {
                    return timetable.events;
                }

            } else {
                return null;
            }
        },
    },
    Mutation: {

        async register(_parent, { email, password }, _context) {
            if (!isEmail(email)) {
                // return res.status(400).send('The email is invalid');
                throw new Error('The email is invalid');
            }

            if ((await _context.db.collection('users').countDocuments({ email: email })) > 0) {
                throw new Error('This email is already being used');
                // return res.status(403).send('This email is already being used');
            }
            var salt = generateSalt();
            var hash = generateHash(password, salt);
            const user = await _context.db.collection('users').insertOne({
                email: email,
                password: hash,
                timetables: [],
                sharedTimetables: [],
                salt: salt
            }).then(({ ops }) => ops[0]);
            
            let token = jwt.sign({id: user._id}, process.env.SESSION_SECRET);
            _context.cookies.set("auth-token", token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 60 * 24 * 7,
                sameSite: "lax"
            });
            return {value: token};
        },

        async login(_parent, { email, password }, _context) {
            if (!isEmail(email)) {
                // return res.status(400).send('The email is invalid');
                // throw new Error('The email is invalid');
                return null;
            }
            const user = await _context.db.collection('users').findOne({email: email}).then(function (userDoc, err) {
                if (err) throw new Error(err);
                if (!userDoc) throw new Error('Invalid Login');
                if (userDoc.password !== generateHash(password, userDoc.salt)) throw new Error('Invalid Login');
                return userDoc;
            });
            let token = jwt.sign({id: user._id}, process.env.SESSION_SECRET);
            _context.cookies.set("auth-token", token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 60 * 24 * 7,
                
            });
            return {value: token};
        },
        async signout(_parent, _args, _context) {
            if(_context.user && _context.user.id) {
                _context.cookies.set("auth-token", '', {
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 60 * 24 * 7,
                    
                });
                return true;
            } else {
                return false;
            }
        },
        async createTimetable(_parent, { title }, _context) {
            
            if(_context.user && _context.user.id) {
                
                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                let timetable = {
                    title: title,
                    userID: user.email,
                    events: []
                }
                const timetableDoc = await _context.db.collection('timetables').insertOne(timetable).then(({ops}) => {
                    _context.db.collection('users').updateOne({email: user.email},{ $addToSet: {timetables : ops[0]._id }},
                        function(err, updatedUser) {
                            // if (err) return res.status(500).end(err);
                            pusher.trigger('timetable-channel', 'timetable-change', {email: user.email, tableID: timetableDoc._id});
                    });

                    return ops[0];
                });
                return timetableDoc;
            } else {
                return null;
            }
        },

        async deleteTimetable(_parent, { tableID }, _context) {
            if(_context.user && _context.user.id) {
                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                const table = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
                if (!table) throw new Error("Timetable does not exist");

                if (table.userID != user.email){
                    // TODO: Should alert the user that only the owner can delete the timetable
                    return null;
                } 
                await _context.db.collection('timetables').findOneAndDelete({_id: ObjectID(tableID)});
                pusher.trigger('timetable-channel', 'timetable-change', {email: user.email, tableID: tableID} );
                _context.db.collection('users').updateOne({ timetables: ObjectID(tableID) }, { $pull: { timetables: ObjectID(tableID)}},
                    function (err, userDocs) {
                        if (err) throw new Error(err);
                    });
                _context.db.collection('users').updateMany({ sharedTimetables: ObjectID(tableID) }, { $pull: { sharedTimetables: ObjectID(tableID)}},
                    function (err, userDocs) {
                        if (err) throw new Error(err);
                    });
                
                return table;
            } else {
                return null;
            }
        },

        async createInvite(_parent, { tableID }, _context) {
            if(_context.user && _context.user.id) {
                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                const table = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
                if (!table) throw new Error("Timetable does not exist");
                const timetableInvite = await _context.db.collection('timetableInvites').findOne({tableID});
                if (!timetableInvite) {
                    const newInvite = await _context.db.collection('timetableInvites').insertOne({tableID: tableID, owner: user.email})
                        .then(({ ops }) => ops[0]);
                    return newInvite;
                }
                return timetableInvite;
            } else {
                return null;
            }
        },

        async inviteUser(_parent, { inviteID }, _context) {
            if(_context.user && _context.user.id) {
                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
                const timetableInvite = await _context.db.collection('timetableInvites').findOne({_id: ObjectId(inviteID)})
                if (!timetableInvite) {
                    throw new Error("Invite does not exist");
                } else {
                    const updatedUser = await _context.db.collection('users').updateOne({_id: ObjectID(_context.user.id)},
                        { $addToSet: {sharedTimetables : ObjectId(timetableInvite.tableID) }});
                    return !!updatedUser;
                }
            }
        },

        async createEvent(_parent, {tableID, title, start, end, description, sharedTimetables}, _context) {
            if(_context.user && _context.user.id) {

                if (!title) {
                    throw new Error("Please enter an event title");
                }
                if (!tableID) {
                    throw new Error("Please select a timetable for this event");
                }
                if (!start || !end) {
                    throw new Error("Please enter a date");

                }

                const timetable = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
                const sharedWithUser = (sharedTimetables.find(timetable => timetable._id == tableID) != null);

                if (!timetable) {
                    throw new Error("timetable does not exist or has been deleted");
                }

                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });

                if (timetable.userID == user.email || sharedWithUser) {
                    let event = {
                        title: title,
                        tableID: tableID,
                        start: start,
                        end: end,
                        description: description
                    }
                    const result = await _context.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID)}, {$push: {events: event}});
                    pusher.trigger('event-channel', 'event-change', {tableID: tableID, user: timetable.userID});
    
                    return result;                
                }
                else {
                    throw new Error("access denied")
                }

            } else {
                return null;
            }
        },
        async deleteEvent(_parent, {tableID, event, sharedTimetables}, _context) {
            if(_context.user && _context.user.id) {

                if (!tableID || !event){
                    throw new Error("Missing input");
                }
            
                const timetable = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
                const sharedWithUser = (sharedTimetables.find(timetable => timetable._id == tableID) != null);
            
                if (!timetable) {
                    throw new Error("timetable does not exist or has been deleted");
                }

                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });
            
                // check to see if signed in user is timetable owner or has been shared with
                if (timetable.userID == user.email || sharedWithUser) {
                    
                    const result = await _context.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID)}, {$pull: {events: event}} );
                    pusher.trigger('event-channel', 'event-change', {tableID: tableID, user: timetable.userID});
            
                    return result;
                }
                else {
                    throw new Error("access denied");
            
                }
            } else {
                return null;
            }
        },
        async updateEvent(_parent, { tableID, oldEvent, newEvent, sharedTimetables }, _context) {
            if(_context.user && _context.user.id) {

                if (!tableID || !oldEvent || !newEvent){
                    throw new Error("Missing input");
                }

                const timetable = await _context.db.collection('timetables').findOne({_id: ObjectID(tableID)});
                const sharedWithUser = (sharedTimetables.find(timetable => timetable._id == tableID) != null);

                if (!timetable) {
                    throw new Error("timetable does not exist or has been deleted");
                }

                const user = await _context.db.collection('users').findOne({_id: ObjectID(_context.user.id)})
                .then((data) => {
                    return data;
                });

                if (timetable.userID == user.email || sharedWithUser) {
                    const result = await _context.db.collection('timetables').findOneAndUpdate({_id: ObjectID(tableID), "events.title": oldEvent.title, "events.start": oldEvent.start, "events.end": oldEvent.end, "events.description": oldEvent.description}, {$set: {"events.$": newEvent}});
                    pusher.trigger('event-channel', 'event-change', {tableID: tableID, user: timetable.userID});
    
                    return result;                
                }
                else {
                    throw new Error("access denied")
                }

            } else {
                return null;
            }
        }
    },
    Date: dateScalar,
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const verifyToken = (token) => {
    if (!token) return null;
    try {
      return jwt.verify(token, process.env.SESSION_SECRET);
    } catch {
      return null;
    }
  };
  

let db;

const apolloServer = new ApolloServer({
    schema,
    context: async ({req, res}) => {
        if (!db) {
            try {
                const dbClient = new MongoClient(MONGODB_URI,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    }
                )

                if (!dbClient.isConnected()) await dbClient.connect()
                db = dbClient.db(MONGODB_DB) // database name
            } catch (e) {
                console.log('--->error while connecting with graphql context (db)', e)
            }
        }
        const cookies = new Cookies(req, res);
        
        const token = cookies.get("auth-token");
        const user = verifyToken(token);
        return { cookies, db, user };
    },
    playground: {
        settings: {
            "request.credentials": "include",
        },
    },
});

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({ path: '/api/graphql' })