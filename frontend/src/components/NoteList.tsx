import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
  useMemo
} from 'react'
import {
  listNotesFromCounselor,
  ListNotesFromCounselorResponse
} from '../api/list_notes_from_counselor'
import {
  listNotesFromRoom,
  ListNotesFromRoomResponse
} from '../api/list_notes_from_room'
import {
  createNote,
  CreateNoteResponse
} from '../api/create_note'
import { useAPI } from '../hooks/api'
import { useInput } from '../hooks/input'
import { useTrackedState } from '../state'

export interface GroupNoteListProps {
  groupID: number
  counselorID: number
}

export function GroupNoteList({
  groupID,
  counselorID
}: GroupNoteListProps) {
  const state = useTrackedState()
  const [noteState, noteDispatch] = useAPI<
    ListNotesFromCounselorResponse
  >()

  useEffect(() => {
    if (state.token != null) {
      listNotesFromCounselor(
        {
          group_id: groupID,
          counselor_id: counselorID
        },
        state.token.access,
        noteDispatch
      )
    }
  }, [groupID, counselorID, state])

  return (
    <>
      {noteState != null ? (
        <NoteList
          groupID={groupID}
          notes={noteState.notes}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export interface RoomNoteListProps {
  groupID: number
  roomID: number
}

export function RoomNoteList({
  groupID,
  roomID
}: RoomNoteListProps) {
  const state = useTrackedState()
  const [noteState, noteDispatch, setNoteState] = useAPI<
    ListNotesFromRoomResponse
  >()

  useEffect(() => {
    if (state.token != null) {
      listNotesFromRoom(
        {
          room_id: roomID
        },
        state.token.access,
        noteDispatch
      )
    }
  }, [roomID, state])

  const newNoteHandler = useCallback(
    (note: { content: string }) => {
      setNoteState(noteState => ({
        notes:
          noteState == null
            ? [note]
            : [note, ...noteState.notes]
      }))
    },
    []
  )

  return (
    <>
      {noteState != null ? (
        <NoteList
          groupID={groupID}
          roomID={roomID}
          onNewNote={newNoteHandler}
          notes={noteState.notes}
        />
      ) : (
        <p>Loading...</p>
      )}
    </>
  )
}

export interface NoteListProps {
  roomID?: number
  groupID: number
  onNewNote?: NewNoteEventHandler
  notes: Array<{ content: string }>
}

export type NewNoteEventHandler = (note: {
  content: string
}) => any

export function NoteList({
  roomID,
  groupID,
  onNewNote,
  notes
}: NoteListProps) {
  const { token } = useTrackedState()
  const [isModalActive, setModalActive] = useState(false)
  const [createNoteResponse, createNoteDispatch] = useAPI<
    CreateNoteResponse
  >()
  const modifiable = useMemo(() => {
    return roomID != null
  }, [roomID])
  const [newNoteContent, newNoteContentHandler] = useInput(
    ''
  )

  const showModal = useCallback(() => {
    setModalActive(true)
  }, [])

  const hideModal = useCallback(() => {
    setModalActive(false)
  }, [])

  const createNoteHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      if (roomID != null && token != null) {
        createNote(
          {
            room_id: roomID,
            group_id: groupID,
            content: newNoteContent
          },
          token.access,
          createNoteDispatch
        )
      }
    },
    [newNoteContent]
  )

  useEffect(() => {
    if (createNoteResponse != null) {
      hideModal()
      onNewNote?.({
        content: newNoteContent
      })
    }
  }, [createNoteResponse])

  return (
    <div className="note-list">
      {modifiable && (
        <div className="note-item">
          <div
            className="note-preview is-new"
            onClick={showModal}>
            <div className="note-preview-inner">New</div>
          </div>
          <div
            className={`modal${
              isModalActive ? ' is-active' : ''
            }`}>
            <div
              className="modal-background"
              onClick={hideModal}></div>
            <div className="modal-content">
              <div className="note-modal">
                <article className="message is-warning">
                  <div className="message-header">
                    새 메모 작성하기
                    <button
                      className="delete"
                      onClick={hideModal}></button>
                  </div>
                  <div className="message-body">
                    <form onSubmit={createNoteHandler}>
                      <div className="field">
                        <div className="control">
                          <textarea
                            className="textarea"
                            placeholder="새 메모의 내용을 작성해주세요."
                            onChange={
                              newNoteContentHandler
                            }>
                            {newNoteContent}
                          </textarea>
                        </div>
                      </div>
                      <div className="field">
                        <div className="control">
                          <input
                            className="button is-link"
                            type="submit"
                            value="저장"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      )}
      {notes.map(note => (
        <NoteItem note={note} />
      ))}
    </div>
  )
}

export interface NoteItemProps {
  note: { content: string }
}

export function NoteItem({ note }: NoteItemProps) {
  const [isModalActive, setModalActive] = useState(false)

  const showModal = useCallback(() => {
    setModalActive(true)
  }, [])

  const hideModal = useCallback(() => {
    setModalActive(false)
  }, [])

  return (
    <div className="note-item">
      <div className="note-preview" onClick={showModal}>
        <div className="note-preview-inner">
          {note.content}
        </div>
      </div>
      <div
        className={`modal${
          isModalActive ? ' is-active' : ''
        }`}>
        <div
          className="modal-background"
          onClick={hideModal}></div>
        <div className="modal-content">
          <div className="note-modal">
            <article className="message is-warning">
              <div className="message-header">
                메모
                <button
                  className="delete"
                  onClick={hideModal}></button>
              </div>
              <div className="message-body">
                {note.content}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
