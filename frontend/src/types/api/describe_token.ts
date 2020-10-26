import JSBI from 'jsbi'
import TokenGroup from '../group'

export interface DescribeUserResponse {
  tid: number
  userID: number
  Groups: {
    [k: number]: {
      id: number
      manager: boolean
      counselor: boolean
    }
  }
  admin: boolean
  cat: string

  email: string
  name: string
}
