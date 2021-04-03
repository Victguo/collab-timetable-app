import { ApolloServer, gql } from 'apollo-server-micro'
import { makeExecutableSchema } from 'graphql-tools'
import { MongoClient } from 'mongodb'
import { GraphQLScalarType, Kind } from 'graphql';
import { ObjectID } from 'bson';

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
    users: User
    timetables(_id: String!): Timetable
  }
`

const resolvers = {
  Query: {
    users(_parent, _args, _context, _info) {
      return _context.db
        .collection('users')
        .findOne()
        .then((data) => {
          return data
        })
    },
    timetables(_parent, {_id}, _context, _info) {
        return _context.db.collection('timetables').findOne({_id: ObjectID(_id)})
    },
  },
  Date: dateScalar,
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

let db

const apolloServer = new ApolloServer({
  schema,
  context: async () => {
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

    return { db }
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apolloServer.createHandler({ path: '/api/graphql' })