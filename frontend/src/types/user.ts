import JSBI from 'jsbi'
import TokenGroup from './group'

export default interface User {
  id: number
  email: string
  gender: 'm' | 'f'
  phoneNumber: string
  name: string
  isAdmin: boolean
  groups: TokenGroup[]
  createdAt: JSBI
  updatedAt: JSBI
}
