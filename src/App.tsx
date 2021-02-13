import React, {useEffect} from 'react';
import SplitPane from 'react-split-pane';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

import Editor from './Editor';
import NoteList from './NoteList';
import Default from './Default';
import Sync from './Sync';
import './App.css';
import {useWindowSize} from './util';
import {INote, useStore} from './store';
import './firebase/init.ts';
import {streamNotes, uploadNotes} from './firebase/firestore';

function App() {
  const windowSize = useWindowSize();
  const {showList, toggleShowList, auth, notes, setNotes, setLastSync} = useStore();

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
          notesToSync.push(note);
          needSync = true;
        } else if (new Date(found.updatedAt) < new Date(note.updatedAt)) {
          notesToSync = notesToSync.map(item => item.id === note.id ? note : item);
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

  return (
    <Router>
      <div className="App">
        <SplitPane
          split="vertical"
          allowResize={showList}
          defaultSize={showList ? '250px' : 0}
          minSize={showList ? 250 : 0}
          maxSize={500}
        >
          {showList ? <NoteList /> : <div />}
          <Switch>
            <Route path="/" exact>
              <Default />
            </Route>
            <Route path="/sync" exact>
              <Sync />
            </Route>
            <Route path="/notes/:id">
              <Editor />
            </Route>
          </Switch>
        </SplitPane>
        <Toaster toastOptions={{className: 'toaster'}} />
      </div>
    </Router>
  );
}

export default App;
