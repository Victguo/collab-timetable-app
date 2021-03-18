import '../styles/global.css';
import React from 'react';
import{ init } from 'emailjs-com';

export default function App({ Component, pageProps }) {
  init(process.env.emailJSUser);
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    console.log(jssStyles);
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return <Component {...pageProps} />
}