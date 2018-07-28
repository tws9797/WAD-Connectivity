import React, { Component } from 'react';
import {
    Platform,
    View,
    Text,
    TextInput,
    Picker,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    DatePickerAndroid,
    StyleSheet,
} from 'react-native';

class InputWithLabel extends Component {
  componentWillMount(){
    this.orientation = this.props.orientation ? (this.props.orientation == 'horizontal' ? 'row' : 'column') : 'column';
  }

  render(){
    return (
      <View style={[inputStyles.container, {flexDirection: this.orientation}]}>
        <Text style={inputStyles.label}>
          {this.props.label ? this.props.label : ''}
        </Text>
        <TextInput style= {[inputStyles.input, this.props.style]}
          placeholder={this.props.placeholder ? this.props.placeholder : ''}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
          multiline={this.props.multiline ? this.props.multiline : false}
          keyboardType={this.props.keyboardType ? this.props.keyboardType : 'default'}
          secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
          selectTextOnFocus={this.props.selectTextOnFocus ? this.props.selectTextOnFocus : false}
          editable={this.props.editable ? this.props.editable : true}
          />
      </View>
    )
  }
}

class PickerWithLabel extends Component{

  componentWillMount() {
    this.orientation = this.props.orientation ? (this.props.orientation == 'horizontal' ? 'row' : 'column') : 'column';
  }

  render() {
      return (
          <View style={[inputStyles.container, {flexDirection: this.orientation}]}>
            <Text style={inputStyles.label}>
              {this.props.label ? this.props.label : ''}
            </Text>
            <Picker
              style={this.props.style}
              mode={this.props.mode ? this.props.mode : 'dropdown'}
              prompt={this.props.prompt ? this.props.prompt : ''}
              selectedValue={this.props.value}
              onValueChange={this.props.onValueChange}
              textStyle={this.props.textStyle ? this.props.textStyle : {fontSize: 18}}
            >
              {this.props.items.map((item, index) => {
                return(<Picker.Item label={item.value} value={item.key} key={item.key} />)
              })}
            </Picker>
          </View>
      )
  }
}

Date.prototype.formatted = function() {
  let day = this.getDay();
  let date = this.getDate();
  let month = this.getMonth();
  let year = this.getFullYear();
  let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  let monthsText = [
    'Jan','Feb','Mar','Apr','May','Jun',
    'Jul','Aug','Sep','Oct','Nov','Dec'
  ];

  return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
}

class DatePickerWithLabel extends Component {

  state = {
    date: new Date(),
    dateText: '',
  }

  openDatePicker = async () => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: this.state.date,
        minDate: new Date(2000, 0, 1),
        maxDate: new Date(2099, 11, 31),
        mode: 'calendar', // try also with `spinner`
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let selectedDate = new Date(year, month, day);

        this.setState({
          date: Date.parse(selectedDate),
          dateText: selectedDate.formatted(),
        });

        this.props.changeDate(this.state.date);
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  render() {
    return (
      <View style={inputStyles.container}>
        <Text style={inputStyles.label}>
          {this.props.label ? this.props.label : ''}
        </Text>
        <TouchableWithoutFeedback
          onPress={
            this.openDatePicker.bind(this)
          }
        >
          <View>
            <TextInput
              style={inputStyles.input}
              value={this.props.value ? this.props.value : this.state.dateText}
              placeholder={this.props.placeholder}
              editable={false}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }
}

const inputStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 3,
        textAlignVertical: 'center',
    },
    input: {
        flex: 3,
        fontSize: 20,
    },
});


class AppButton extends Component{
  componentWillMount(){
    if(this.props.theme) {
      switch(this.props.theme) {
        case 'success':
            this.backgroundColor = '#449d44';
            break;
        case 'info':
            this.backgroundColor = '#31b0d5';
            break;
        case 'warning':
            this.backgroundColor = '#ec971f';
            break;
        case 'danger':
            this.backgroundColor = '#c9302c';
            break;
        case 'primary':
        default:
            this.backgroundColor = '#286090';
      }
    }
    else {
      this.backgroundColor = '#286090';
    }
  }

  render() {
    return (
      <TouchableNativeFeedback
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
        background={Platform.OS === 'android' ? TouchableNativeFeedback.SelectableBackground() : ''}>
      <View style={[buttonStyles.button, this.props.style, {backgroundColor: this.backgroundColor}]}>
        <Text style={buttonStyles.buttonText}>{this.props.title}</Text>
      </View>
      </TouchableNativeFeedback>
    )
  }
}

const buttonStyles = StyleSheet.create({
    button: {
        margin: 5,
        alignItems: 'center',
    },
    buttonText: {
        padding: 20,
        fontSize: 20,
        color: 'white'
    },
});

module.exports = {
  InputWithLabel: InputWithLabel,
  DatePickerWithLabel: DatePickerWithLabel,
  PickerWithLabel: PickerWithLabel,
  AppButton: AppButton,
}
