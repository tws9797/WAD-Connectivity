exports.getValue = (array, key) => {
  return array.filter((o) => o.key === key)[0].value
}

exports.states = [
  {key: '01', value: 'Johor'},
  {key: '02', value: 'Kedah'},
  {key: '03', value: 'Kelantan'},
  {key: '14', value: 'Kuala Lumpur'},
  {key: '15', value: 'Labuan'},
  {key: '04', value: 'Melaka'},
  {key: '05', value: 'Negeri Sembilan'},
  {key: '06', value: 'Pahang'},
  {key: '07', value: 'Penang'},
  {key: '08', value: 'Perak'},
  {key: '09', value: 'Perlis'},
  {key: '16', value: 'Putrajaya'},
  {key: '12', value: 'Sabah'},
  {key: '13', value: 'Sarawak'},
  {key: '10', value: 'Selangor'},
  {key: '11', value: 'Terengganu'},
];
