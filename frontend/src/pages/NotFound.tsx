import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>페이지를 찾을 수 없습니다.</h1>
      <h3>죄송합니다. 요청하신 페이지를 찾을 수 없습니다.</h3>
      <img src="/404.png" alt="404 image" />
      <Link to="/">
        <button className="black">
          <i className="fas fa-home"></i>홈으로 돌아가기
        </button>
      </Link>
    </div>
  )
}
