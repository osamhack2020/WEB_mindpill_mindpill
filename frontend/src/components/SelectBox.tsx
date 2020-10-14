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

type SelectBoxProps = {
  name: string
  values: Array<string>
  placeholder?: string
  required?: boolean
}

type SelectBoxState = {
  chosenValue: string
}

export default function SelectBox({ name, values, placeholder, required }: SelectBoxProps) {
  const [chosenValue, setChosenValue] = useState<string>('')

  function changeValue(value: string) {
    setChosenValue(value)
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
  }
  function handleFocus(e: React.ChangeEvent<HTMLInputElement>) {
    e.target.blur()
  }
  return (
    <div className="input-select">
      <input
        value={chosenValue}
        placeholder={placeholder}
        type="text"
        name={name}
        onChange={handleChange}
        required={required}
        onFocus={handleFocus}
        pattern={
          '/' +
          values.reduce((a, c) => {
            return (a = a + '|' + c)
          }) +
          '/'
        }
      />
      <div className="options">
        {values.map((value, key) => (
          <Option value={value} changeValue={changeValue} key={key} />
        ))}
      </div>
    </div>
  )
}
