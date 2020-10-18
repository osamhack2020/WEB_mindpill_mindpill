import React, { useState } from 'react'

type InputProps = {
  name?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  required?: boolean
  value?: string
  helperMessage?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  autofocus?: boolean
}

type InputState = {
  helperMessageOn: boolean
  focused: boolean
}

export default function Input({
  name,
  defaultValue,
  placeholder,
  type,
  required,
  value,
  helperMessage,
  maxLength,
  minLength,
  pattern,
  autofocus
}: InputProps) {
  const [helperMessageOn, setHelperMessageOn] = useState<boolean>(false)
  const [focused, setFocused] = useState<boolean>(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {}

  function handleFocus(e: React.ChangeEvent<HTMLInputElement>) {
    setFocused(true)
  }

  function handleBlur(e: React.ChangeEvent<HTMLInputElement>) {
    setFocused(false)
  }

  return (
    <div className="input-custom">
      <input
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        name={name}
        required={required}
        value={value}
        pattern={pattern}
        autoFocus={autofocus}
        minLength={minLength}
        maxLength={maxLength}
      />
      {helperMessage && focused && <div className="helper-message">{helperMessage}</div>}
    </div>
  )
}
