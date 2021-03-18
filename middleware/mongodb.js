import { MongoClient } from 'mongodb';

const { MONGODB_URI, MONGODB_DB } = process.env

const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(MONGODB_DB);
  return next();
}

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