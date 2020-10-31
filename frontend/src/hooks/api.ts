import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react'
import { AsyncDispatch, useAsyncReducer } from './async'

export function useAPI<T>(): [
  T | null,
  AsyncDispatch<T>,
  Dispatch<SetStateAction<T | null>>
] {
  const [state, dispatch] = useAsyncReducer<T>()
  const [result, setResult] = useState<T | null>(null)

  useEffect(() => {
    if (state.data != null) {
      setResult(state.data)
    }
  }, [state])

  return [result, dispatch, setResult]
}
