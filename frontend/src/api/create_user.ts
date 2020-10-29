import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface CreateUserRequest {
  email: string
  password: string
  name: string
  sv_number: string
  gender: 'm' | 'f'
  phone_number: string
  rank_id: number
  group_id: number
}

export interface CreateUserResponse {
  user_id: number
}

export function createUser(
  req: CreateUserRequest,
  dispatch: AsyncDispatch<CreateUserResponse>
) {
  handleAPI(dispatch, () => {
    return post(`/api/create_user`, req)
  })
}
