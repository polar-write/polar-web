import {useEffect} from 'react';
import firebase from 'firebase';
import toast from 'react-hot-toast';

import { useStore } from '../store';
import { getSyncCode } from './firestore';

export function useAuth() {
  const {auth, setAuth, setSyncCode} = useStore();

  async function startAuth() {
    if (!firebase.auth().currentUser || !auth) {
      try {
        const result = await firebase.auth().signInAnonymously();
        const uid = (result.user as any).uid;
        setAuth({uid});
        const syncCode = await getSyncCode(uid);
        if (syncCode) {
          setSyncCode(syncCode);
        }
      } catch (error) {
        toast(error.message);
      }
    }
  }

  useEffect(() => {
    startAuth();
  }, []);
}
