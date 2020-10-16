import React, { useEffect, useState } from 'react'

import database from '../tempDatabase'

export function MessageTool() {
  return (
    <div className="toolbox-message">
      <div className="toolbox-message-header">
        <span>해당 상담에 대하여 메세지 보내기</span>
      </div>
      <div className="toolbox-message-content"></div>
    </div>
  )
}

type PreviousMemo = {
  title: string
  content: string
  timestamp: string
}

export function PreviousMemo({ title, content, timestamp }: PreviousMemo) {
  const [clicked, setClicked] = useState<boolean>(false)
  const contentLengthLimit = 60
  function handleClick() {
    setClicked(clicked => !clicked)
  }
  return (
    <div className={`previous-memo ${clicked && 'clicked'}`} onClick={handleClick}>
      <div className="title">{title}</div>
      <div className="content">
        {clicked ? content : content.length > contentLengthLimit ? content.slice(0, contentLengthLimit) + '...' : content}
      </div>
      <div className="timestamp">{timestamp}</div>
    </div>
  )
}

export function MemoTool() {
  const [add, setAdd] = useState<boolean>(false)
  const [previousMemos, setPreviousMemos] = useState<PreviousMemo[]>([])

  useEffect(() => {
    getPreviousMemo()
  }, [])

  function getPreviousMemo() {
    //이전 메모를 불러올 수 있는 api 를 지정해야합니다.
    const data = database.API_PREVIOUS_MEMOS
    setPreviousMemos(data)
  }

  function handleAddClick() {
    setAdd(add => !add)
  }

  function handleNewMemoChange(e: React.ChangeEvent<HTMLTextAreaElement>) {}
  return (
    <div className="toolbox-memo">
      <div className="toolbox-memo-header">
        <div className="header-content">
          {add ? <span>새 메모</span> : <span>홍길동과 관련된 메모 7건</span>}

          <span className="add" onClick={handleAddClick}>
            {add ? <i className="fas fa-times"></i> : <i className="fas fa-plus"></i>}
          </span>
        </div>
        {add && (
          <div className="new-memo">
            <textarea rows={10} onChange={handleNewMemoChange}></textarea>
            <button className="letter">저장</button>
          </div>
        )}
      </div>
      <div className="toolbox-memo-content">
        {previousMemos.map((memo, index) => (
          <PreviousMemo key={index} title={memo.title} content={memo.content} timestamp={memo.timestamp} />
        ))}
      </div>
    </div>
  )
}

export default function Toolbox() {
  const [tab, setTab] = useState<number>(0)
  return (
    <div className="toolbox">
      <div className="toolbox-navbar">
        <ul>
          <li
            className={tab == 0 ? 'selected' : ''}
            onClick={() => {
              setTab(0)
            }}>
            <i className="fas fa-edit"></i>메모 남기기
          </li>
          <li
            className={tab == 1 ? 'selected' : ''}
            onClick={() => {
              setTab(1)
            }}>
            <i className="fas fa-envelope"></i>쪽지 보내기
          </li>
        </ul>
      </div>
      <div className="toolbox-content">
        {(() => {
          switch (tab) {
            case 0:
              return <MemoTool />
            case 1:
              return <MessageTool />
          }
        })()}
      </div>
    </div>
  )
}
