import React from 'react'
import { GlobalData } from '../App'

type HomeProps = {
  globalData: GlobalData
}

export default function Home({ globalData }: HomeProps) {
  return <div>This is HomePage</div>
}
