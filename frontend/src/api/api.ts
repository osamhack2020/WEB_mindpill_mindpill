import { AxiosResponse } from 'axios'
import { AsyncDispatch } from '../hooks/async'

export async function handleAPI<T>(
  dispatch: AsyncDispatch<T>,
  cb: () => Promise<AxiosResponse<T>>
) {
  dispatch({ type: 'LOADING' })
  const response = await cb()
  if (response.status !== 200) {
    dispatch({ type: 'ERROR', error: response.data })
    return
  }
  dispatch({ type: 'SUCCESS', data: response.data })
  return response.data
}
