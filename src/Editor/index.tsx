import React, {useRef, useEffect, useState} from 'react';
import 'codemirror/lib/codemirror.css';
import 'polar-tui-editor/dist/toastui-editor.css';
import {useParams, useHistory} from 'react-router-dom';
import { Editor } from 'polar-tui-editor-react';
import {ChevronLeft, ChevronRight, MoreHorizontal, X, Trash2, Copy, Share, CloudOff, Cloud, Smartphone} from 'react-feather';
import toast from 'react-hot-toast';

import {useStore} from '../store';
import {isElectron, useWindowSize} from '../util';
import './editor.css';
import NotFound from '../NotFound';

function PolarEditor() {
  const editorRef = useRef(null);
  const history = useHistory();
  const {id} = useParams<any>();
  const {notes, editNote, showList, toggleShowList, deleteNote, duplicateNote, syncCode, removeJustSynced} = useStore();
  const windowSize = useWindowSize();
  const [showMenu, setShowMenu] = useState(false);

  const note = notes.find(note => note.id === id && !note.removedAt);

  const isMobile = (windowSize.width && windowSize.width < 769);

  useEffect(() => {
    setShowMenu(false);
    isMobile && toggleShowList(false);
    (editorRef.current as any)?.getInstance().focus();
    (editorRef.current as any)?.getInstance().setMarkdown(note?.content);
  }, [id]);

  useEffect(() => {
    if (note?.justSynced) {
      (editorRef.current as any)?.getInstance().setMarkdown(note?.content);
      removeJustSynced(note.id);
    }
  }, [note?.justSynced]);

  function handleChange() {
    const value = (editorRef.current as any).getInstance().getMarkdown();
    editNote(id, value);
  }

  function handleDelete() {
    if (note) {
      deleteNote(note.id);
      history.replace('/')
      toast.success('Note deleted!');
    }
    setShowMenu(false);
  }

  function handleDuplicate() {
    if (note) {
      const id = duplicateNote(note.content);
      history.replace(`/notes/${id}`)
      toast.success('Note duplicated!');
    }
    setShowMenu(false);
  }

  function handleExport() {
    toast.error('Sorry, we are working on it!');
    setShowMenu(false);
  }

  if (!note) {
    return <NotFound />
  }

  return (
    <div className="editor-wrapper">
      <Editor
        ref={editorRef}
        initialValue={note.content}
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
      {isMobile && (
        <button className="back-button" onClick={() => toggleShowList(!showList)}>
          {!showList ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      {(!showList || !isMobile) && (
        <>
          <button className="menu-button" onClick={() => setShowMenu(!showMenu)}>
            {!showMenu ? <MoreHorizontal /> : <X />}
          </button>
          <button className="sync-button" onClick={() => history.replace('/')}>
            {!syncCode ? <CloudOff /> : <Cloud />}
          </button>
          {!isElectron && (
            <button className="app-button" onClick={() => history.replace('/download')}>
              <Smartphone />
            </button>
          )}
        </>
      )}
      {showMenu && (
        <div className="menu-list">
          <button className="menu-item" onClick={handleDelete}>
            <Trash2 />
            <span>Delete</span>
          </button>
          <button className="menu-item" onClick={handleDuplicate}>
            <Copy />
            <span>Duplicate</span>
          </button>
          <button className="menu-item" onClick={handleExport}>
            <Share />
            <span>Export</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default PolarEditor;
