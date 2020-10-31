import {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useState,
  useCallback
} from 'react'

export function useInput(
  defValue: string
): [
  string,
  ChangeEventHandler,
  Dispatch<SetStateAction<string>>
] {
  const [value, setValue] = useState(defValue)

  const cb = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value)
    },
    []
  )

  return [value, cb, setValue]
}
