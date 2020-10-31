import { AsyncDispatch } from '../hooks/async'
import { get } from '../utils/http'
import { handleAPI } from './api'

export interface DescribeUserResponse {
  sv_number: string
  email: string
  name: string
  gender: 'm' | 'f'
  phone_number: string
  rank: string
  created_at: string
  updated_at: string
}

export function describeUser(
  userID: number,
  dispatch: AsyncDispatch<DescribeUserResponse>
) {
  handleAPI(dispatch, () => {
    return get(`/api/describe_user?user_id=${userID}`)
  })
}
