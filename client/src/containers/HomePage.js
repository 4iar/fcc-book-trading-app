import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';

import Venue from '../components/Venue';
import LocationSearch from '../components/LocationSearch';
import NavBar from '../components/NavBar';
import '../styles/homepage.scss';


function getState(state) {
  return {
    venues: state.venues.venues,
    loading: state.venues.loading
  };
}

@connect(getState)
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      venues: undefined,
      loading: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      venues: newProps.venues,
      loading: newProps.loading
    });
  }

  render() {
    return (
      <div>
        <NavBar />
        <LocationSearch query={this.props.location.query} />
        {this.state.loading &&
        <div className="loading-spinner-container">
          <CircularProgress className="loading-spinner" size={1} />
        </div>
        }

        {this.state.venues && this.state.venues.length === 0 &&
        <h2 style={{textAlign: 'center'}}>Nothing going on here :(</h2>
        }

        {this.state.venues && this.state.venues.length > 0 &&
        this.state.venues.map((v) => {
          return (
            <Venue key={v.id} venue={v}/>
          );
        })}
      </div>
    );
  }
}
