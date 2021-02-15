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
import PrivacyPolicy from './PrivacyPolicy';
import './App.css';
import {useStore} from './store';
import useSyncNote from './firebase/useSyncNote';
import { useAuth } from './firebase/auth';

function App() {
  const {showList} = useStore();
  useAuth();
  useSyncNote();

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
            <Route path="/privacy-policy" exact>
              <PrivacyPolicy />
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
