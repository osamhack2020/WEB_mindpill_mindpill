import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div id="page_404">
      <img src="/404.png" alt="404 image" />
      <h3>
        죄송합니다. <br />
        요청하신 페이지가 존재하지 않습니다.
      </h3>
      <Link to="/">
        <button className="styled sized black">
          <i className="fas fa-home"></i> &nbsp; 홈으로 돌아가기
        </button>
      </Link>
    </div>
  )
}
