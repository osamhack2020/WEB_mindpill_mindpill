import { AsyncDispatch } from '../hooks/async'
import { post } from '../utils/http'
import { handleAPI } from './api'

export interface SearchGroupRequest {
  keyword: string
}

export interface SearchGroupResponse {
  groups: Array<{
    id: number
    name: string
  }>
}

export function searchGroup(dispatch: AsyncDispatch<SearchGroupResponse>) {
  handleAPI(dispatch, () => {
    return post(`/api/search_group`)
  })
}
