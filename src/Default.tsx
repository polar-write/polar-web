import React, {useState} from 'react';
import {RefreshCw, LogOut, ChevronLeft, ChevronRight, LogIn, Copy} from 'react-feather';
import moment from 'moment';
import toast from 'react-hot-toast';
import QRCode from 'qrcode.react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {useStore} from './store';

import { isElectron, useWindowSize } from './util';
import { updateSyncCode } from './firebase/firestore';

interface DefaultProps {}

const Default: React.FC<DefaultProps> = () => {
  const {showList, toggleShowList, syncCode, setSyncCode, lastSync, auth} = useStore();
  const windowSize = useWindowSize();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  async function handleStartSync() {
    await updateSyncCode(auth?.uid);
    setSyncCode(auth?.uid);
  }

  async function handleEnterSyncCode() {
    if (inputValue.trim().length < 28) {
      return;
    }
    await updateSyncCode(auth?.uid, inputValue.trim());
    setSyncCode(inputValue.trim());
    setInputValue('');
    setShowInput(false);
  }

  async function handleStopSync() {
    try {
      await updateSyncCode(auth?.uid, null);
      setSyncCode(null);
      toast.success('Logout success!');
    } catch (error) {
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
      {!syncCode ? (
        <>
          <img src={isElectron() ? 'http://polar.quocs.com/logo512.png' : "/logo512.png"} alt="polar" className="default-logo" />
          <div className="login-options">
            {!showInput ? (
              <>
                <button className="login-button" onClick={handleStartSync}>
                  <RefreshCw />
                  <span>Start sync</span>
                </button>
                <button className="login-button" onClick={() => setShowInput(true)}>
                  <LogIn />
                  <span>Enter sync code</span>
                </button>
              </>
            ) : (
              <>
                <input
                  autoFocus
                  placeholder="Sync code"
                  className="sync-code-input"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleEnterSyncCode();
                    } else if (e.key === 'Escape') {
                      setInputValue('');
                      setShowInput(false);
                    }
                  }}
                />
                <button className="login-button" onClick={handleEnterSyncCode}>
                  <LogIn />
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <QRCode value={syncCode} bgColor='#FBF6E7' size={200} imageSettings={{src: isElectron() ? 'http://polar.quocs.com/logo192.png' : '/logo192.png', width: 40, height: 40}} />
          <p className="last-sync">Last sync: {lastSync ? moment(lastSync).calendar() : 'Unknown'}</p>
          <div className="login-options">
            <CopyToClipboard text={syncCode} onCopy={() => toast.success('Your sync code copied to clipboard!')}>
              <button className="login-button">
                <Copy />
                <span>Copy sync code</span>
              </button>
            </CopyToClipboard>
            <button className="login-button" onClick={handleStopSync}>
              <LogOut />
              <span>Stop sync</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Default;
