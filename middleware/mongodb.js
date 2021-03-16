import { MongoClient } from 'mongodb';
import nextConnect from 'next-connect';

const { MONGODB_URI, MONGODB_DB } = process.env

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(MONGODB_DB);
  return next();
}
const middleware = nextConnect();
middleware.use(database);
export default middleware;


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
 let cached = global.mongo

 if (!cached) {
   cached = global.mongo = { conn: null, promise: null }
 }
 
 export async function connectToDatabase() {
   if (cached.conn) {
     return cached.conn
   }
 
   if (!cached.promise) {
     const opts = {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     }
 
     cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
       return {
         client,
         db: client.db(MONGODB_DB),
       }
     })
   }
   cached.conn = await cached.promise
   return cached.conn
 }