// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { useRouter } from 'next/router';
// import useSWR from 'swr';
import middleware from '../middleware/index';
import Pusher from 'pusher-js';
import { useEffect } from 'react';

export var pusher = new Pusher('3d233baf43924a505592', {
  cluster: 'us2',
  encrypted: true
})

const timetableChannel = pusher.subscribe('timetable-channel');
const eventChannel = pusher.subscribe('event-channel');

export default function Homepage({timetables, sharedTimetables, user}) {

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  }

  useEffect(() => {
    timetableChannel.bind('timetable-change', updateUser => {
      // check if the user is the currently signed in one
      //      need to add in if the user is shared with the timetable too
      if (user.email == updateUser){
        
        refreshData();
      }
    })
  }, []); // only change if user changes

  return (
    // add a loading screen for fetching data
    
    <Dashboard eventChannel={eventChannel} timetables = {timetables} sharedTimetables={sharedTimetables} refreshData={refreshData} user={user}>
    </Dashboard>
  )
}

export async function getServerSideProps({req, res}) {
  await middleware.run(req, res);

  let timetable = {};
  let user = null;

  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

  if (req.headers.cookie){
    const response = await fetch(baseUrl + '/api/user/getuser', {
      headers: {
        cookie: req.headers.cookie
      },
      method: 'GET',
      credentials: 'include'
    });
    
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
          console.log(timetable);
        }
      }
  
    } else {
      console.log(await response.text());
    }
  }
  return {
    props: {
      timetables: timetable.timetables,
      sharedTimetables: timetable.sharedTimetables,
      user: user
    },
  };

}
