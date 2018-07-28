import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  TextInput,
  Text,
  View,
  DatePickerAndroid,
  ScrollView,
} from 'react-native';
import {
  InputWithLabel,
  PickerWithLabel,
  DatePickerWithLabel,
  AppButton,
} from './UI';

let config = require('./Config');
let common = require('./CommonData');

export default class EditScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return {
      title: 'Edit ' + navigation.getParam('headerTitle')
    };
  };

  constructor(props){
    super(props);

    this.state = {
      id: this.props.navigation.getParam('id'),
      name: '',
      city: '',
      date: ''
    }

    this._load = this._load.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this._load();
  }

  _load() {
    let url = config.settings.serverPath + '/api/places/' + this.state.id;

    fetch(url)
    .then((response) => {
      if(!response.ok){
        Alert.alert('Error', response.status.toString());
        throw Error('Error ' + response.status);
      }

      return response.json()
    })
    .then((place) => {
      this.setState({
        name: place.name,
        city: place.city,
        date: place.date
      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _update() {
    let url = config.settings.serverPath + '/api/places/' + this.state.id;

    fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        id: this.state.id,
        name: this.state.name,
        city: this.state.city,
        date: this.state.date
      }),
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
        Alert.alert('Record Updated', 'Record for `' + this.state.name + '` has been updated');
      }
      else {
        Alert.alert('Error updating record');
      }

      this.props.navigation.getParam('refresh')();
      this.props.navigation.getParam('homeRefresh')();
      this.props.navigation.goBack();
    })
    .catch((error) => {
      console.error(error);
    });
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
          date: selectedDate,
          dateText: selectedDate.formatted(),
        });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  onChangeDate(newDate){
    this.setState({
      date: newDate
    });
  }

  render() {

    return(
      <ScrollView style={styles.container}>
        <InputWithLabel style={styles.label}
          label={'Name'}
          value={this.state.name}
          onChangeText={(name)=>this.setState({name})}
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
          value={new Date(this.state.date).toLocaleDateString()}
          label={'Date'}
          placeholder={'Choose a date'}
          changeDate={this.onChangeDate.bind(this)}
        />
        <AppButton style={styles.button}
          title={'Save'}
          theme={'primary'}
          onPress={this._update}
          />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  output: {
    fontSize: 24,
    color: '#000099',
    marginTop: 10,
    marginBottom: 10,
  },
});
