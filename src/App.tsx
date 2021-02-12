import React, {useRef} from 'react';
import 'codemirror/lib/codemirror.css';
import 'polar-tui-editor/dist/toastui-editor.css';

import { Editor } from 'polar-tui-editor-react';

import './App.css';

function App() {
  const editorRef = useRef(null);

  function handleChange() {
    const value = (editorRef.current as any).getInstance().getMarkdown();
    localStorage.setItem('polar', value || '');
  }

  return (
    <div className="App">
      <Editor
        ref={editorRef}
        initialValue={localStorage.getItem('polar') || `# A wonderful new note\nKeep calm and write something`}
        height="100vh"
        initialEditType="markdown"
        useCommandShortcut={true}
        hideModeSwitch
        onChange={handleChange}
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
