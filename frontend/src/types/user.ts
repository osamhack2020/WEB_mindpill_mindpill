import TokenGroup from './group'

export default interface User {
  id: number
  isAdmin: boolean
  groups: TokenGroup[]

  email: string
  name: string
}
