import JSBI from 'jsbi'
import TokenGroup from '../group'

export interface DescribeTokenResponse {
  tid: number
  userID: number
  groups: Array<{
    id: number
    manager: boolean
    counselor: boolean
  }>
  admin: boolean
  cat: string

  email: string
  name: string
}
