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
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const baseUrl = req ? `${protocol}://${req.headers.host}` : '';
  let invited = false;

  if (query.inviteID){
    const response = await fetch(baseUrl + '/api/graphql', {
      method: 'POST',
      headers: {
        cookie: req.headers.cookie,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        query: `
          mutation {
            inviteUser(
              inviteID: "${query.inviteID}"
            )
          }
        `,
      }),
    });
    const data = await response.json();
    if (!data.errors) {
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