import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState
} from 'react'

export interface SearchResult {
  id: number
  name: string
}

export interface SearchSelectProps {
  search: (keyword: string) => any
  searchResults: SearchResult[] | null
  onSelect: (id: number | null) => any
}

export function SearchSelect({
  search,
  searchResults,
  onSelect
}: SearchSelectProps) {
  const [id, setID] = useState<number | null>(null)
  const [input, setInput] = useState('')
  const [isActive, setActive] = useState(false)

  const inputHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()

      const { value } = e.currentTarget
      setInput(value)

      if (value.length > 0) {
        search(value)
      }
    },
    [search]
  )

  useEffect(() => {
    const results = searchResults || []
    const clarified =
      results.length > 0 && results[0].name === input
    if (clarified) {
      setID(results[0].id)
    } else {
      setID(null)
    }
    setActive(
      results.length > 1 ||
        (!clarified && results.length > 0)
    )
  }, [searchResults, input])

  const selectHandler = useCallback((value: string) => {
    setInput(value)
  }, [])

  useEffect(() => {
    onSelect(id)
  }, [id])

  return (
    <div className="search-select">
      <input
        type="text"
        className="input"
        onChange={inputHandler}
        value={input}
      />

      <div
        className={`search-results${
          isActive ? ' is-active' : ''
        }`}>
        {searchResults?.map(item => (
          <SearchItem
            name={item.name}
            onSelect={selectHandler}
          />
        ))}
      </div>
    </div>
  )
}

export interface SearchItemProps {
  name: string
  onSelect: (name: string) => void
}

export function SearchItem(props: SearchItemProps) {
  const selectHandler = useCallback(() => {
    props.onSelect(props.name)
  }, [])

  return (
    <div className="search-item" onClick={selectHandler}>
      {props.name}
    </div>
  )
}
