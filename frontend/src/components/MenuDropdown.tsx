import React, { useState } from 'react'

type OptionProps = {
  children?: React.ReactNode
  hr?: boolean
  colored?: boolean
  onClick?: () => void
}

export function Option({ children, hr, colored, onClick }: OptionProps) {
  return (
    <div onClick={onClick} className={`menu_dropdown_option ${hr && 'hr'} ${colored && 'colored'}`}>
      {children}
    </div>
  )
}

type MenuDropdownProps = {
  children?: React.ReactNode
}

export function MenuDropdown({ children }: MenuDropdownProps) {
  const [showOptions, setShowOptions] = useState<boolean>(false)
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    setShowOptions(showOptions => !showOptions)
  }
  function handleOptionsClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    handleBlur()
  }
  function handleBlur() {
    setShowOptions(false)
  }
  return (
    <button className="menu_dropdown" onBlur={handleBlur}>
      <div className="icon" onClick={handleClick}>
        <i className="fas fa-ellipsis-h"></i>
      </div>
      {showOptions && (
        <div className="menu_dropdown_options" onClick={handleOptionsClick}>
          {children}
        </div>
      )}
    </button>
  )
}
