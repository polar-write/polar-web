import {useEffect} from 'react';
import toast from 'react-hot-toast';

import {streamNotes, uploadNotes} from './firestore';
import {INote, useStore} from '../store';
import {useWindowSize} from '../util';

function useSyncNote() {
  const windowSize = useWindowSize();
  const {toggleShowList, auth, notes, setNotes, setLastSync} = useStore();

  useEffect(() => {
    if (windowSize.width && windowSize.width < 769) {
      toggleShowList(false);
    } else if (windowSize.width && windowSize.width >= 769) {
      toggleShowList(true);
    }
  }, [windowSize, toggleShowList]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = streamNotes(auth?.uid, { next: (querySnapshot: any) => {
      let notesToSync = notes;
      let needSync = false;
      console.log('check sync', querySnapshot.docs.length)
      querySnapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        const note: INote = {
          ...data,
          updatedAt: data?.updatedAt?.toDate?.() || null,
          createdAt: data?.createdAt?.toDate?.() || null,
          removedAt: data?.removedAt?.toDate?.() || null,
        };
        const found = notesToSync.find(item => item.id === note.id);
        if (!found) {
          notesToSync.push({...note, justSynced: true});
          needSync = true;
        } else if (new Date(found.updatedAt) < new Date(note.updatedAt)) {
          notesToSync = notesToSync.map(item => item.id === note.id ? {...note, justSynced: true} : item);
          needSync = true;
        }
      });
      if (needSync) {
        console.log('ready sync', notesToSync);
        setNotes(notesToSync);
        toast.success('Notes synced!')
        setLastSync();
      } else {
        console.log('no need to sync');
      }
    }});

    const intervalId = setInterval(async () => {
      const synced = await uploadNotes(auth?.uid, notes);
      if (synced) {
        setLastSync();
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(intervalId);
    };
  }, [auth, notes, setNotes, setLastSync]);
}

export default useSyncNote;
