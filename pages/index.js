// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { useRouter } from 'next/router';
// import useSWR from 'swr';

export default function Homepage({timetables}) {

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    // add a loading screen for fetching data
    
    <Dashboard timetables = {timetables} refreshData={refreshData}>
    </Dashboard>
  )
}

export async function getServerSideProps(context) {

  const res = await fetch('http://localhost:3000/api/timetables', {
    method: 'GET',
  });
  let timetable = [];
  if (res.status === 200) {
    timetable = await res.json();
  }

  return {
    props: {
      timetables: timetable,
    },
  };

}
