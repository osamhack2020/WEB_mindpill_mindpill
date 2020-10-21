import React, { useState } from 'react'

type OptionProps = {
  children?: React.ReactNode
  hr?: boolean
  colored?: boolean
}

export function Option({ children, hr, colored }: OptionProps) {
  return <div className={`menu_dropdown_option ${hr && 'hr'} ${colored && 'colored'}`}>{children}</div>
}

type MenuDropdownProps = {
  children?: React.ReactNode
}

export function MenuDropdown({ children }: MenuDropdownProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false)
  function handleClick() {
    setShowOptions(showOptions => !showOptions)
  }
  function handleBlur() {
    setShowOptions(false)
  }
  return (
    <button className="menu_dropdown" onBlur={handleBlur}>
      <div className="icon" onClick={handleClick}>
        <i className="fas fa-ellipsis-h"></i>
      </div>
      {showOptions && <div className="menu_dropdown_options">{children}</div>}
    </button>
  )
}
