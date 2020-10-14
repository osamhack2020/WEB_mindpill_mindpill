import React, { useState } from 'react'

type OptionProps = {
  value: string
  changeValue?: (value: string) => void
}

export function Option({ value, changeValue }: OptionProps) {
  function handleClick() {
    if (changeValue != null) {
      changeValue(value)
    }
  }

  return (
    <div className="option" onClick={handleClick}>
      {value}
    </div>
  )
}

type SelectBySearchProps = {
  name: string
  values: Array<string>
  placeholder?: string
  required?: boolean
}

export default function SelectBySearch({ name, values, placeholder, required }: SelectBySearchProps) {
  const [chosenValue, setChosenValue] = useState<string>('')
  const [stateValues, setStateValues] = useState<string[]>(values)
  const [focused, setFocused] = useState<boolean>(false)

  const changeValue = (value: string) => {
    setChosenValue(value)
    setStateValues([])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStateValues(values.filter(value => value.includes(e.target.value)))
    setChosenValue(e.target.value)
  }

  function handleFocus(e: React.ChangeEvent<HTMLInputElement>) {
    setFocused(true)
  }
  function handleBlur(e: React.ChangeEvent<HTMLDivElement>) {
    setFocused(false)
  }
  return (
    <div className="input-select search">
      <input
        value={chosenValue}
        placeholder={placeholder}
        type="text"
        name={name}
        onChange={handleChange}
        required={required}
        onFocus={handleFocus}
        pattern={values.reduce((a, c) => {
          return (a = a + '|' + c)
        })}
      />
      {focused && (
        <div className="options">
          {stateValues.map((value, key) => (
            <Option value={value} changeValue={changeValue} key={key} />
          ))}
        </div>
      )}
    </div>
  )
}
