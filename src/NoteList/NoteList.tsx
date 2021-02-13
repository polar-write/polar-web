import React, { useState, ChangeEvent } from 'react';
import {Edit, Search} from 'react-feather';
import moment from 'moment';
import {Link, useRouteMatch, useHistory} from 'react-router-dom';

import './styles.css';
import {useStore, INote} from '../store';
import {getMarkdownExcerpt} from '../util';

interface NoteListProps {}

const NoteItem = ({note}: {note: INote}) => {
  const to = `/notes/${note.id}`;
  let match = useRouteMatch({
    path: to,
    exact: true,
  });

  return (
    <li>
      <Link to={to} className="note-item-link">
        <div className={`note-item-container ${match && `active`}`}>
          <p className="note-date">{moment(note.updatedAt).calendar()}</p>
          <p className="note-excerpt">{getMarkdownExcerpt(note.content) || 'A wonderful new note'}</p>
        </div>
      </Link>
    </li>
  )
}

const NoteList: React.FC<NoteListProps> = () => {
  const {notes, newNote} = useStore();
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');

  function handleNewNote() {
    setSearchValue('');
    const id = newNote();
    history.push(`/notes/${id}`);
  }

  function handleSearch(e: ChangeEvent) {
    setSearchValue((e.target as any).value);
  }

  const filteredNotes = searchValue?.length ? notes.filter((note: INote) => (note.content).toLowerCase().includes(searchValue.toLowerCase())) : notes;

  return (
    <div className="list-wrapper">
      <div className="list-header">
        <div className="search-wrap">
          <Search className="search-icon" />
          <input placeholder="Polar Search" className="search-input" onChange={handleSearch} value={searchValue} />
        </div>
        <button className="new-note" onClick={handleNewNote}>
          <Edit />
        </button>
      </div>
      <ul className="note-list">
        {filteredNotes.map(note => (
          <NoteItem key={note.id} note={note} />
        ))}
      </ul>
    </div>
  )
}

export default NoteList;
