// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { connectToDatabase } from '../middleware/mongodb'
import middleware from '../middleware/index';

export default function Homepage({timetables, user}) {

  return (
    // <Layout home>
    //   <Head>
    //     <title>{siteTitle}</title>
    //   </Head>
    //   <section className={utilStyles.headingMd}>
    //     <p>[Your Self Introduction]</p>
    //     <p>
    //       (This is a sample website - you’ll be building a site like this on{' '}
    //       <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
    //     </p>
    //   </section>
    // </Layout>
    // <>
    <Dashboard timetables = {timetables} user={user}>
    </Dashboard>
  )
}

export async function getServerSideProps({req, res}) {
  await middleware.run(req, res);
  const { db } = await connectToDatabase();
  const movies = await db
  .collection("movies")
  .find({})
  .sort({ metacritic: -1 })
  .limit(20)
  .toArray();
  const response = await fetch('http://localhost:3000/api/user', {
    headers: {
      cookie: req.headers.cookie
    },
    method: 'GET',
    credentials: 'include'
  });
  let user;
  if (response.status === 200) {
    user = await response.json();
  } else {
    console.log(await response.text());
  }
  return {
    props: {
      timetables: movies,
      user: user
    },
  };

}
