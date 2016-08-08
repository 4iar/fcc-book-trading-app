import React from 'react';
import Geosuggest from 'react-geosuggest';
import {connect} from 'react-redux';
import 'react-geosuggest/module/geosuggest.css';

import {fetchVenues} from '../actions/venuesActions';


@connect(null, {fetchVenues})
export default class LocationSearch extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.query.lon && this.props.query.lat) {
      this.props.fetchVenues({
        lat: this.props.query.lat,
        lon: this.props.query.lon,
      });
    }
  }

  handleSuggestSelect(place) {
    this.props.fetchVenues({lat: place.location.lat, lon: place.location.lng});
  }

  render() {
    return (
      <Geosuggest onSuggestSelect={this.handleSuggestSelect.bind(this)}/>
    );
  }
}
