import {
  ChangeEvent,
  ChangeEventHandler,
  useState,
  useCallback
} from 'react'

export function useInput(
  defValue: string
): [string, ChangeEventHandler] {
  const [value, setValue] = useState(defValue)

  const cb = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.currentTarget.value)
    },
    []
  )

  return [value, cb]
}
