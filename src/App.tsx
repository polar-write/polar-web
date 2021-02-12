import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'polar-tui-editor/dist/toastui-editor.css';

import { Editor } from 'polar-tui-editor-react';

import './App.css';

function App() {
  return (
    <div className="App">
      <Editor
        initialValue={`# A wonderful new note\nKeep calm and write something`}
        height="100vh"
        initialEditType="markdown"
        useCommandShortcut={true}
        hideModeSwitch
        toolbarItems={[
          'heading',
          'bold',
          'italic',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          'divider',
          'image',
          'link',
        ]}
      />
    </div>
  );
}

export default App;
