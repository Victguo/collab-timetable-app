// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { useRouter } from 'next/router';
// import useSWR from 'swr';
import middleware from '../middleware/index';

export default function Homepage({timetables, user}) {

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  return (
    // add a loading screen for fetching data
    
    <Dashboard timetables = {timetables} refreshData={refreshData} user={user}>
    </Dashboard>
  )
}

export async function getServerSideProps({req, res}) {
  await middleware.run(req, res);

  let timetable = [];

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

  const response = await fetch(baseUrl + '/api/user', {
    headers: {
      cookie: req.headers.cookie
    },
    method: 'GET',
    credentials: 'include'
  });
  let user;
  if (response.status === 200) {
    user = await response.json();

    if (user.email){
      const res = await fetch(baseUrl + '/api/timetables/' + user.email, {
        headers: {
          cookie: req.headers.cookie
        },
        method: 'GET',
      });
      if (res.status === 200) {
        timetable = await res.json();
      }
    }

  } else {
    console.log(await response.text());
  }
  return {
    props: {
      timetables: timetable,
      user: user
    },
  };

}
