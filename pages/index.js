// import Head from 'next/head'
// import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Dashboard from '../components/Dashboard'
import { useRouter } from 'next/router';
// import useSWR from 'swr';

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
      
      const sharedWithUser = (sharedTimetables.find(timetable => timetable._id == updateUser.tableID) != null);
      // check if the user is the currently signed in one or is shared with the timetable 
      if (user.email == updateUser.email || sharedWithUser){
        
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

  let timetable = {timetables: [], sharedTimetables: []};
  let user = {};
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';

  if (req.headers.cookie){
    const response = await fetch(baseUrl + '/api/graphql', {
      method: 'POST',
      headers: {
        cookie: req.headers.cookie,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          {
            user {
              email
              timetables
              sharedTimetables
            }
          }
        `,
      }),
    });

    const data = await response.json();
    user = data?.data?.user;

    if (!user) {
      user = {}
    } else {
      if (!data.errors) {    
        const timetableRes = await fetch(baseUrl + '/api/graphql', {
          method: 'POST',
          headers: {
            cookie: req.headers.cookie,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            query: `
            {
              timetables {
                _id
                title
                userID
                events {
                  title
                  tableID
                  start
                  end
                  description
                }
              }
            }
            `,
          }),
        });
        const timetableData = await timetableRes.json();
        if (!timetableData.errors) {
          timetable.timetables = timetableData.data.timetables;
        }
        const sharedTimetableRes = await fetch(baseUrl + '/api/graphql', {
          method: 'POST',
          headers: {
            cookie: req.headers.cookie,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            query: `
            {
              sharedTimetables {
                _id
                title
                userID
                events {
                  title
                  tableID
                  start
                  end
                  description
                }
              }
            }
            `,
          }),
        });
        const sharedTimetableData = await sharedTimetableRes.json();
        if (!sharedTimetableData.errors) {
          timetable.sharedTimetables = sharedTimetableData.data.sharedTimetables;
        }
      } else {
        console.log(data.errors[0].message);
      }
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
