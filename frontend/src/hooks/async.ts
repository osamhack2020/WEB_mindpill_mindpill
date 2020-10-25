import { DependencyList, Reducer, useReducer, useEffect } from 'react'

export interface AsyncAction<T> {
  type: 'LOADING' | 'SUCCESS' | 'ERROR'
  data?: T
  error?: any
}

export interface AsyncState<T> {
  executed: boolean
  loading: boolean
  data?: T
  error?: any
}

export type AsyncReducer<T> = Reducer<AsyncState<T>, AsyncAction<T>>

export function asyncReducer<T>(
  state: AsyncState<T>,
  action: AsyncAction<T>
): AsyncState<T> {
  switch (action.type) {
    case 'LOADING':
      return {
        executed: true,
        loading: true
      }
    case 'SUCCESS':
      return {
        executed: true,
        loading: false,
        data: action.data
      }
    case 'ERROR':
      return {
        executed: true,
        loading: false,
        error: action.error
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export function useAsyncReducer<T>() {
  return useReducer<AsyncReducer<T>>(asyncReducer, {
    executed: false,
    loading: false
  })
}

export function useAsync<T>(cb: () => Promise<T>, deps: DependencyList = []) {
  const [state, dispatch] = useAsyncReducer<T>()

  const fetchData = async () => {
    dispatch({ type: 'LOADING' })
    try {
      const data = await cb()
      dispatch({ type: 'SUCCESS', data })
    } catch (error) {
      dispatch({ type: 'ERROR', error })
    }
  }

  useEffect(() => {
    fetchData()
  }, deps)

  return [state, fetchData]
}
