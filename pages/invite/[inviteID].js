import { useRouter } from 'next/router';
import middleware from '../../middleware/index';

export default function InvitePage({invited}) {
  const router = useRouter();
  const { inviteID } = router.query;
  console.log(invited);
  if(invited) {
    return <p>Invite Successful</p>
  } else {
    return <p>Invite Failed</p>
  }
  
}

export async function getServerSideProps({req, res, query}) {
  await middleware.run(req, res);


  const response = await fetch('http://localhost:3000/api/invite/' + query.inviteID, {
    headers: {
      cookie: req.headers.cookie
    },
    method: 'POST',
    credentials: 'include'
  });
  let invited;
  if (response.status === 200) {
    invited = true;

  } else {
    invited = false;
    console.log('yayeet');
    console.log(await response.text());
  }
  return {
    props: {
      invited: invited
    },
  };
}