import middleware from '../../middleware/index';
import { useRouter } from 'next/router';

export default function InvitePage({invited}) {
  const router = useRouter();
  const { inviteID } = router.query;

  if(invited && process.browser) {
    router.replace('/');
    return <p>Invite Success</p>;
  } else {
    return <p>Invite Failed</p>
  }
  
}

export async function getServerSideProps({req, res, query}) {
  await middleware.run(req, res);
  let invited = false;

  if (query.inviteID){
    const response = await fetch('http://localhost:3000/api/invite/' + query.inviteID, {
      headers: {
        cookie: req.headers.cookie
      },
      method: 'POST',
      credentials: 'include'
    });
    if (response.status === 200) {
      invited = true;

    } else {
      invited = false;
    }
  }

  return {
    props: {
      invited: invited
    },
  };
}