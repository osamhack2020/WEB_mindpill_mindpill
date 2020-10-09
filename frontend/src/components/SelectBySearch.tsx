import React from 'react'

export interface OptionProps {
  value: string
  onClick?: (value: string) => void
}

export class Option extends React.Component<OptionProps> {
  handleClick = () => {
    if (this.props.onClick != null) {
      this.props.onClick(this.props.value)
    }
  }

  render() {
    return (
      <div className="option" onClick={this.handleClick}>
        {this.props.value}
      </div>
    )
  }
}

export interface SelectBySearchProps {
  name: string
  values: Array<string>
  placeholder?: string
  required?: boolean
}

export interface SelectBySearchState {
  chosenValue: string
  values: Array<string>
  focused: boolean
}

export default class SelectBySearch extends React.Component<SelectBySearchProps, SelectBySearchState> {
  state = {
    chosenValue: '',
    values: this.props.values,
    focused: false
  }

  changeValue = (value: string) => {
    this.setState({ chosenValue: value })
    this.setState({ values: [] })
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      values: this.props.values.filter(value => value.includes(e.target.value))
    })
    this.setState({ chosenValue: e.target.value })
  }

  handleFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ focused: true })
  }
  handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ focused: false })
  }
  render() {
    return (
      <div className="input-select search">
        <input
          value={this.state.chosenValue}
          placeholder={this.props.placeholder}
          type="text"
          name={this.props.name}
          onChange={this.handleChange}
          required={this.props.required}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          pattern={this.props.values.reduce((a, c) => {
            return (a = a + '|' + c)
          })}
        />
        {this.state.focused && (
          <div className="options">
            {this.state.values.map((value, key) => (
              <Option value={value} onClick={this.changeValue} key={key} />
            ))}
          </div>
        )}
      </div>
    )
  }
}
