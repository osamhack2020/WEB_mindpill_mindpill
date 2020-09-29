import React from 'react'
import PropTypes from 'prop-types';

class Option extends React.Component {

    handleClick = () => {
        this.props.changeValue(this.props.value);
    }

    render() {
        return (
            <div className='option' onClick={this.handleClick}>
                {this.props.value}
            </div>
        )
    }
}

Option.propTypes = {
    value: PropTypes.string.isRequired,
}

class SelectBox extends React.Component {

    state = {
        chosenValue: '',
    }

    changeValue = (value) => {
        this.setState({chosenValue: value});
    }

    handleChange = (e) => {
        e.preventDefault();
    }

    render() {
        
        return (
            
            <div className='input-select'>
                <input value={this.state.chosenValue} placeholder={this.props.placeholder} type='text' name={this.props.name} onChange={this.handleChange} disabled/>
                <div className='options'>
                    {this.props.values.map((value, key) => <Option value={value} changeValue={this.changeValue} key={key} />)}
                </div>
                
            </div>
        )
    }
}

SelectBox.propTypes = {
    name: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    placeholder: PropTypes.string.isRequired,
}

export default SelectBox
