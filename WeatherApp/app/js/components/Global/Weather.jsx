import React from 'react';
import AppBar from 'material-ui/AppBar';
import {Card, CardHeader, CardTitle, CardMedia, CardText} from 'material-ui/Card';
import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import {White} from 'material-ui/styles/colors';

const styles = {
  cardBox :{
    width:'50%',
    display:'inline-block'
  },
  forecast : {
    width:193,
    textAlign:'center',
    display:'inline-block'
  },
  searchIcon:{
    // color:'#FFFFFF'

  }
}

export default class Weather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'dataSource': [],
      'area': '',
      'curr_summary': '',
      'curr_temperature': '',
      'curr_wind': '',
      'curr_humidity': '',
      'curr_time': '',
      'curr_icon': '',
      'curr_pressure':'',
      'curr_uvIndex':'',
      'curr_visibility':'',
      'curr_ozone':'',
      'foreTime':[],
      'foreIconurl':[],
      'foreMaxTemp':[],
      'foreMinTemp':[],
      'foreSum':[]

    }
  }
  componentDidMount() {
    //https://api.darksky.net/forecast/669a2dfdabd4ba00b8028c9c17bf6963/37.8267,-122.4233
    let url = "http://localhost:5000/";

    var header = new Headers({'Access-Control-Allow-Origin': '*'});
    fetch(url, {headers: header}).then((result) => {
      return result.json();
    }).then((data) => {

      // for current weather information

      // Unix Time Converter
      let unix_timestamp = data.currently.time;
      var date = new Date(unix_timestamp * 1000);

      // Icons
      var icon = data.currently.icon;
      let iconurl = "/app/img/icons/weather-" + icon + ".png";
      console.log(iconurl);
      let currSummary = data.currently.summary;
      let currTemp = data.currently.temperature;
      let currHumid = data.currently.humidity;
      let currWind = data.currently.windSpeed;
      let currPressure = data.currently.pressure;
      let currUvIndex = data.currently.uvIndex;
      let currVisibility = data.currently.visibility;
      let currOzone = data.currently.ozone;
      this.setState({'curr_time': date})
      this.setState({'curr_icon': iconurl})
      this.setState({'curr_summary': currSummary});
      this.setState({'curr_temperature': currTemp});
      this.setState({'curr_humidity': currHumid});
      this.setState({'curr_wind': currWind});
      this.setState({'curr_pressure': currPressure});
      this.setState({'curr_uvIndex': currUvIndex});
      this.setState({'curr_visibility': currVisibility});
      this.setState({'curr_ozone': currOzone});

      // for forecast weather information
      // unix time Converter

      data.daily.data.map((times)=>{
        let d = new Date(times.time*1000);
        this.setState((prevState)=>({
          'foreTime':prevState.foreTime.concat(d.toString().substring(0,3))
        }));
        console.log(this.state.foreTime);
      });
      // icons
      var icon = data.daily.data.map((icons)=>{
        this.setState((prevState)=>({
          'foreIconurl':prevState.foreIconurl.concat("/app/img/icons/weather-" + icons.icon + ".png")
        }));
      });
      //max temperature
      data.daily.data.map((maxTemp)=>{
        this.setState((prevState)=>({
          'foreMaxTemp':prevState.foreMaxTemp.concat(maxTemp.temperatureHigh)
        }));
      });
      //min temperature
      data.daily.data.map((minTemp)=>{
        this.setState((prevState)=>({
          'foreMinTemp':prevState.foreMinTemp.concat(minTemp.temperatureLow)
        }));
      });
      //Summary
      data.daily.data.map((summary)=>{
        this.setState((prevState)=>({
          'foreSum':prevState.foreSum.concat(summary.summary)
        }));
      });


    }).catch((error) => {
      console.log(error);
    })
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
    this.onLoadRequest.bind(this);
  }
  render() {
    return (<div>
      <AppBar
        title="Title"
        iconElementRight= {
          <div>
            <Paper style={{padding:'5px 20px 0px 20px'}}>
              <AutoComplete
              hintText="Enter the place here"
              dataSource={this.state.dataSource}
              onUpdateInput={this.handleUpdateInput.bind(this)}
              onNewRequest={this.handleNewRequest.bind(this)}
              filter={(searchText, key) => true}
              underlineShow={false}
              />

            <FontIcon
            className='material-icons'
            style={styles.searchIcon}
            >
            search
            </FontIcon>
            </Paper>
          </div>
        }
      />
      <Card style={{width:'50%', display:'inline-block'}}>
        <CardHeader title={this.state.area} titleColor="#878787" subtitle={"Last Update: " + this.state.curr_time} subtitleColor="#878787" titleStyle={{
            fontSize: "24px",
            fontWeight: "100"
          }} subtitleStyle={{
            fontSize: "16px",
            fontWeight: "100"
          }}/>
        <CardTitle title={this.state.curr_summary}/>
        <CardMedia>
          <div>
            <img src={this.state.curr_icon} width="88px" height="88px"/>
            <span style={{
                fontSize: "64px",
                display: "inline"
              }}>{this.state.curr_temperature}
            </span>
            <span style={{
                verticalAlign: '35px',
                fontWeight: '500'
              }}>&#8451;</span>
              </div>
              <div>
                <List>
                  <ListItem
                  primaryText="Wind"
                  >
                  <span style={{float:'right'}}>{this.state.curr_wind}</span>
                  </ListItem>
                  <ListItem
                  primaryText="Humidity"
                  >
                  <span style={{float:'right'}}>{this.state.curr_humidity}</span>
                  </ListItem>
                  <ListItem
                  primaryText="Pressure"
                  >
                  <span style={{float:'right'}}>{this.state.curr_pressure}</span>
                  </ListItem>
                  <ListItem
                  primaryText="UVIndex"
                  >
                  <span style={{float:'right'}}>{this.state.curr_uvIndex}</span>
                  </ListItem>
                  <ListItem
                  primaryText="Visibility"
                  >
                  <span style={{float:'right'}}>{this.state.curr_visibility}</span>
                  </ListItem>
                  <ListItem
                  primaryText="Ozone"
                  >
                  <span style={{float:'right'}}>{this.state.curr_ozone}</span>
                  </ListItem>
                  <ListItem
                  primaryText="Ozone"
                  rightIcon={<FlatButton> {this.props.curr_wind}</FlatButton>}
                  />
                </List>
              </div>
        </CardMedia>
      </Card>


      <Card style={{width:'50%', display:'inline-block'}}>
        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[0]}</h4>
          <img src={this.state.foreIconurl[0]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[0]}</span>
          <span>Max: {this.state.foreMaxTemp[0]}</span>
          </span>
        </Paper>

        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[1]}</h4>
          <img src={this.state.foreIconurl[1]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[1]}</span>
          <span>Max: {this.state.foreMaxTemp[1]}</span>
          </span>
        </Paper>

        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[2]}</h4>
          <img src={this.state.foreIconurl[2]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[2]}</span>
          <span>Max: {this.state.foreMaxTemp[2]}</span>
          </span>
        </Paper>

        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[3]}</h4>
          <img src={this.state.foreIconurl[3]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[3]}</span>
          <span>Max: {this.state.foreMaxTemp[3]}</span>
          </span>
        </Paper>
        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[4]}</h4>
          <img src={this.state.foreIconurl[4]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[4]}</span>
          <span>Max: {this.state.foreMaxTemp[4]}</span>
          </span>
        </Paper>
        <Paper>
          <span style={{margin: '10px', padding:'20px'}}>
          <h4 style={{display:'inline-block', margin: '20px', paddingRight:'100px'}}>{this.state.foreTime[5]}</h4>
          <img src={this.state.foreIconurl[5]} width="50px" height="50px" style={{paddingRight:'100px',paddingTop:'20px'}}/>
          <span style = {{paddingRight:'30px'}}>Min: {this.state.foreMinTemp[5]}</span>
          <span>Max: {this.state.foreMaxTemp[5]}</span>
          </span>
        </Paper>
      </Card>
      </div>
    );
  }
}
