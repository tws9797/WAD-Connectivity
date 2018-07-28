import React, { Component } from 'react';
import {
  StyleSheet,
  Alert,
  TextInput,
  Text,
  DatePickerAndroid,
  ScrollView
} from 'react-native';

import {
  InputWithLabel,
  PickerWithLabel,
  DatePickerWithLabel,
  AppButton
} from './UI';

let config = require('./Config');
let common = require('./CommonData');

export default class CreateScreen extends Component {

  static navigationOptions = {
    title: 'Add Place'
  };

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      city: '',
      date: '',
    };

    this._insert = this._insert.bind(this);
  }

  _insert() {
    let url = config.settings.serverPath + '/api/places';

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        name: this.state.name,
        city: this.state.city,
        date: this.state.date
      })
    })
    .then((response) => {
      if(!response.ok) {
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((responseJson) => {
      if(responseJson.affected > 0) {
        Alert.alert('Record Saved', 'Record for `' + this.state.name + '` has been saved');
      }
      else {
        Alert.alert('Error saving record');
      }

      this.props.navigation.getParam('refresh')();
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error(error);
    })
  }

  onChangeDate(newDate){
    this.setState({
      date: newDate
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.input}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name) => {this.setState({name})}}
          orientation={'vertical'}
        />
        <InputWithLabel style={styles.input}
          label={'City'}
          value={this.state.city}
          onChangeText={(city) => {this.setState({city})}}
          orientation={'vertical'}
        />
        <DatePickerWithLabel style={styles.input}
          onPress={this.openDatePicker}
          label={'Date'}
          placeholder={'Choose a date'}
          changeDate={this.onChangeDate.bind(this)}
        />
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._insert}
        />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  picker: {
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});
