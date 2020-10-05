import React from 'react'

export interface InputProps {
  name?: string
  defaultValue?: string
  placeholder?: string
  type?: string
  required?: boolean
  value?: string
  checkValidity?: (value: string) => boolean
}

export interface InputState {
  helperMessageOn: boolean
}

export default class Input extends React.Component<InputProps, InputState> {
  state = {
    helperMessageOn: false
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.checkValidity) {
      this.setState({ helperMessageOn: this.props.checkValidity(e.target.value) })
    }
  }

  render() {
    return (
      <div className="input-custom">
        <input
          defaultValue={this.props.defaultValue}
          placeholder={this.props.placeholder}
          type={this.props.type}
          name={this.props.name}
          required={this.props.required}
          value={this.props.value}
          onChange={this.handleChange}
        />
        {this.state.helperMessageOn ? (
          <div className="helper-message">
            <span>값을 입력하세요.</span>
          </div>
        ) : (
          <></>
        )}
      </div>
    )
  }
}
