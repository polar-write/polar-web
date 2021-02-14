import React from 'react';
import SplitPane from 'react-split-pane';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
// import firebase from 'firebase';

import Editor from './Editor';
import NoteList from './NoteList';
import Default from './Default';
import Download from './Download';
import './App.css';
import {useStore} from './store';
import './firebase/init.ts';
import useSyncNote from './firebase/useSyncNote';

function App() {
  const {showList} = useStore();
  useSyncNote();

  // useEffect(() => {
  //   firebase.auth().getRedirectResult().then(rs => {
  //     console.log(rs)
  //     if (rs.user) {
  //       setAuth(rs.user);
  //       toast.success(`You logged in as ${rs.user.displayName}!`);
  //     }
  //   });
  // }, []);

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
            <Route path="/download" exact>
              <Download />
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
