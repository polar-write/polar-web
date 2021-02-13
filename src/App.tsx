import React, {useEffect} from 'react';
import SplitPane from 'react-split-pane';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Editor from './Editor';
import NoteList from './NoteList';
import Default from './Default';
import './App.css';
import {useWindowSize} from './util';
import {useStore} from './store';

function App() {
  const windowSize = useWindowSize();
  const {showList, toggleShowList} = useStore();

  useEffect(() => {
    if (windowSize.width && windowSize.width < 769) {
      toggleShowList(false);
    } else if (windowSize.width && windowSize.width >= 769) {
      toggleShowList(true);
    }
  }, [windowSize, toggleShowList]);

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
