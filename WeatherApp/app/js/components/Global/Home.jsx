import React from 'react';
import {Link} from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import Paper from 'material-ui/Paper';

import Weather from './Weather.jsx';

import Image from '../../../img/weather.jpg';

const styles = {
  bodyContainer:{
    background:`url(${"../../../app/img/weather.jpg"}) no-repeat center center fixed`,
    position: 'fixed',
    display:'inline-block',
    backgroundSize:'cover',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: 700
  },
  divContainer: {
    margin: 'auto',
    width:'50%',
    textAlign:'center',
    marginTop:'20%'
  },
  titleName: {
    fontFamily:'Orbitron',
    fontWeight: 900,
    fontColor: 'white'
  },
  paperContainer : {
    paddingLeft: 10
  }
}

export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'dataSource':[],
      'location':''
    }
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position)=>{
      this.setState({
        'location': position.coords.latitude+","+position.coords.longitude
      })
    });
  }
  handleUpdateInput(value) {
    // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=bengaluru&types=geocode&language=fr&key=AIzaSyBo6aZUg9mqcQ0EaJCwtpv8zLgh4MbQxaM
      this.setState({'dataSource':[]});
      var placeUrl = 'http://localhost:5000/google';
      fetch(placeUrl)
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
          data.predictions.map((place)=>{
              this.setState((prevState) => (
                {'dataSource':prevState.dataSource.concat(place.structured_formatting.main_text)}));
            console.log(this.state.dataSource);
          });
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  handleNewRequest(value){
    var geocoder = new google.maps.Geocoder();
    console.log(geocoder);
    geocoder.geocode({'address' : value},function(results,status){
      if(status == google.maps.GeocoderStatus.OK){
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        this.setState({'location':latitude+","+longitude});
        console.log(this.state.location);
      }
    }.bind(this))
  }

  render(){
    return(
      <div>
        {this.state.location?
          <Weather loc = {this.state.location}/>
          :
              <div style  = {styles.bodyContainer}>
                <div style = {styles.divContainer} >
                  <h1 style = {{color:'#4DD0E1',fontFamily:'Orbitron',fontWeight:900,fontSize:'44px'}} >Seasons</h1>
                  <Paper style = {styles.paperContainer}>
                      <AutoComplete
                        disableFocusRipple = {false}
                        hintText="Search City or Place for e.g. Bengaluru"
                        underlineShow={false}
                        dataSource={this.state.dataSource}
                        onUpdateInput={this.handleUpdateInput.bind(this)}
                        onNewRequest={this.handleNewRequest.bind(this)}
                        filter={(searchText, key) => true}
                        fullWidth= {true}
                      />
                  </Paper>
                  <h6 style = {{color:'#4DD0E1',fontFamily:'Orbitron',fontWeight:900,fontSize:'20px'}} >Search for the state of the atmosphere in terms of temperature, wind, clouds, humidity</h6>
                </div>
              </div>
          }
          </div>
    );
  }
}
