import React from 'react';
import {GitHub, LogOut, ChevronLeft, ChevronRight} from 'react-feather';
import moment from 'moment';
import toast from 'react-hot-toast';

import {useStore} from './store';

import { useWindowSize } from './util';
import { signInWithGithub, signOut } from './firebase/auth';

interface DefaultProps {}

const Default: React.FC<DefaultProps> = () => {
  const {showList, toggleShowList, auth, setAuth, lastSync} = useStore();
  const windowSize = useWindowSize();

  async function handleLogin() {
    const user = await signInWithGithub();
    if (user) {
      setAuth(user);
      toast.success(`You logged in as ${user.displayName}!`);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      setAuth(null);
      toast.success('Logout success!');
    } catch (error) {
      setAuth(null);
      toast.error(error.message);
    }
  }

  const isMobile = (windowSize.width && windowSize.width < 769);

  return (
    <div className="default-wrapper">
      {isMobile && (
        <button className="back-button" onClick={() => toggleShowList(!showList)}>
          {!showList ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      <img src="/logo512.png" alt="polar" className="default-logo" />
      {!auth ? (
        <button className="login-button" onClick={handleLogin}>
          <GitHub />
          <span>Login with Github</span>
        </button>
      ) : (
        <>
          <p className="last-sync">Last sync: {lastSync ? moment(lastSync).calendar() : 'Unknown'}</p>
          <button className="login-button" onClick={handleLogout}>
            <LogOut />
            <span>Logout</span>
          </button>
        </>
      )}
    </div>
  )
}

export default Default;
