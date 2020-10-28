import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'

export interface SearchResult {
  id: number
  name: string
}

export interface SearchSelectProps {
  search: (keyword: string) => any
  searchResults: SearchResult[] | null
  onSelect: (id: number) => any
}

export function SearchSelect(props: SearchSelectProps) {
  const [id, setID] = useState<number | null>(null)
  const [input, setInput] = useState('')

  const inputHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const { value } = e.currentTarget
      setInput(value)
      if (value.length > 0) {
        props.search(value)
      }
    },
    [props]
  )

  const selectHandler = useCallback((id: number, name: string) => {
    setID(id)
    setInput(name)
  }, [])

  useEffect(() => {
    if (id != null) {
      props.onSelect(id)
    }
  }, [id])

  return (
    <div className="search-select">
      <input
        type="text"
        className="input"
        onChange={inputHandler}
        value={input}
      />

      <div className="search-results">
        {props.searchResults?.map(item => (
          <SearchItem id={item.id} name={item.name} onSelect={selectHandler} />
        ))}
      </div>
    </div>
  )
}

export interface SearchItemProps {
  id: number
  name: string
  onSelect: (id: number, name: string) => void
}

export function SearchItem(props: SearchItemProps) {
  const selectHandler = useCallback(() => {
    props.onSelect(props.id, props.name)
  }, [])

  return (
    <div className="search-item" onClick={selectHandler}>
      {props.name}
    </div>
  )
}
