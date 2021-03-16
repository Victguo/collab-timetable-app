// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { connectToDatabase } from '../util/mongodb'

export default function Homepage({timetables}) {

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
    <Dashboard timetables = {timetables}>
    </Dashboard>
  )
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const movies = await db
  .collection("movies")
  .find({})
  .sort({ metacritic: -1 })
  .limit(30)
  .toArray();

  return {
    props: {
      timetables: JSON.parse(JSON.stringify(movies)),
    },
  };

}
