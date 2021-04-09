import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb'
import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectID } from 'bson';
import isEmail from 'validator/lib/isEmail';
import middleware from '../../middleware/index';
import jwt from "jsonwebtoken";
import Cookies from "cookies";
import { generateHash, generateSalt } from '../../utils/auth';



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

  type User {
    _id: ID
    email: String
    password: String
    salt: String
    timetables: [String]
  }
  type Timetable {
      _id: ID
      title: String
      owner: String
      events: [Event]
  }
  type Event {
      title: String
      tableID: String
      start: Date
      end: Date
      description: String
  }

  type Query {
    users: [User]
    timetables(_id: String!): Timetable
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`

const resolvers = {
    Query: {
        users(_parent, _args, _context, _info) {
            return _context.db
                .collection('users')
                .find()
                .toArray()
                .then((data) => {
                    console.log(data);
                    return data
                })
        },
        timetables(_parent, { _id }, _context, _info) {
            return _context.db.collection('timetables').findOne({ _id: ObjectID(_id) })
        },
    },
    Mutation: {

        async register(_parent, { email, password }, _context) {
            if (!isEmail(email)) {
                // return res.status(400).send('The email is invalid');
                throw new Error('The email is invalid');
            }

            if ((await req.db.collection('users').countDocuments({ email: email })) > 0) {
                throw new Error('This email is already being used');
                // return res.status(403).send('This email is already being used');
            }
            var salt = generateSalt();
            var hash = generateHash(password, salt);
            const user = await _context.db.collection('users').insertOne({
                email: email,
                password: hash,
                timetables: [],
                salt: salt
            }).then(({ ops }) => ops[0]);
            
            let token = jwt.sign({id: user._id}, process.env.SESSION_SECRET);
            _context.cookies.set("auth-token", token, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax"
            });
            return user;
        },

        async login(_parent, { email, password }, _context) {
            console.log(_context.user);
            if (!isEmail(email)) {
                // return res.status(400).send('The email is invalid');
                throw new Error('The email is invalid');
            }
            console.log("here");
            const user = await _context.db.collection('users').findOne({email: email}).then(function (userDoc, err) {
                console.log(err);
                console.log(userDoc);
                if (err) throw new Error(err);
                if (!userDoc) throw new Error('Invalid Login');
                if (userDoc.password !== generateHash(password, userDoc.salt)) throw new Error('Invalid Login');
                return userDoc;
            });
            let token = jwt.sign({id: user._id}, process.env.SESSION_SECRET);
            _context.cookies.set("auth-token", token, {
                httpOnly: false,
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
                sameSite: "lax"
            });
            // console.log(token);
            return user;
        },
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
})

export const config = {
    api: {
        bodyParser: false,
    },
}

export default apolloServer.createHandler({ path: '/api/graphql' })