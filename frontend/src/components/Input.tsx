import React from 'react'

export interface InputProps {
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

export interface InputState {
  helperMessageOn: boolean
  focused: boolean
}

export default class Input extends React.Component<InputProps, InputState> {
  state = {
    helperMessageOn: false,
    focused: false
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {}

  handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ focused: true })
  }

  handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ focused: false })
  }

  render() {
    return (
      <div className="input-custom">
        <input
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          defaultValue={this.props.defaultValue}
          placeholder={this.props.placeholder}
          type={this.props.type}
          name={this.props.name}
          required={this.props.required}
          value={this.props.value}
          pattern={this.props.pattern}
          autoFocus={this.props.autofocus}
        />
        {this.props.helperMessage && this.state.focused && <div className="helper-message">{this.props.helperMessage}</div>}
      </div>
    )
  }
}
