import React from 'react';
import {Card, CardActions, CardText, CardMedia, CardTitle} from 'material-ui/Card';
import {cyan700} from 'material-ui/styles/colors';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/maps/directions-run';
import {connect} from 'react-redux';

import {attendVenue} from '../actions/venuesActions';

import '../styles/venue.scss';


@connect(null, {attendVenue})
export default class Venue extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getVenueObj(this.props.venue);
  }
  
  componentWillReceiveProps(newProps) {
    this.setState(this.getVenueObj(newProps.venue));
  }
  
  getVenueObj(venue) {
    return {
      name: venue.name,
      description: venue.description,
      thumbnailUrl: venue.thumbnailUrl,
      headerUrl: venue.headerUrl,
      numGoing: venue.numGoing,
      distance: venue.distance,
      phone: venue.phone,
      userGoing: venue.userGoing,
      id: venue.id
    };
  }
  
  handleClick() {
    this.props.attendVenue(this.state.id);
  }

  render() {
    return (
      <Card className="venue">

        <CardMedia className="image" size={30} >
          <img src={this.state.headerUrl} />
        </CardMedia>
        
        <CardTitle className="title">
          <div>{this.state.name}</div>
        </CardTitle>

        <CardText className="info">
          <div className="align-left">{this.state.phone}</div>
          <div className="align-right">{this.state.distance} metres away</div>
        </CardText>

        <CardText className="description">
          {this.state.description}
        </CardText>

        <CardActions>
          <div className="attend" >
            <Badge
              badgeContent={this.state.numGoing}
              secondary={true}
              badgeStyle={{top: 12, right: 12}}
            >
              <IconButton onClick={this.handleClick.bind(this)} tooltip="Attend">
                <NotificationsIcon color={this.state.userGoing ? cyan700 : null} secondary={true}/>
              </IconButton>
            </Badge>
          </div>
        </CardActions>
      </Card>
    );
  }
}
