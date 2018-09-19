import React, { Component } from 'react';
import axios from 'axios';
import { Grid, Row, Col } from 'react-bootstrap';
import WeatherCart from './components/WeatherCart';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    const hours = [];
    let currentHour = 0;

    while(currentHour < 24) {
      hours.push(`${currentHour < 10 ? `0${currentHour}` : currentHour}:00:00`);
      currentHour += 3;
    }

    this.state = {
      nextDays: [],
      currentCity: '',
      hours,
      selectedHour: '15:00:00'
    };

    this.changeHour = this.changeHour.bind(this);
  }

  componentDidMount() {
    axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=54.372158&lon=18.638306&APPID=5b38fbd15002feaef5198fc90fb05c41').then(
      response => {
        const { city: { name: cityName, country }, list } = response.data;
        const currentCity = `${cityName} (${country})`;

        this.setState({
          currentCity,
          nextDays: list
        });
      },
      err => console.error(err)
    );
  }

  changeHour(e) {
    this.setState({selectedHour: e.target.value});
  }

  render() {
    const { currentCity, nextDays, selectedHour, hours } = this.state;

    return (
      <section className="app">
        <h1 className="app__title">{currentCity}</h1>
        <div className="app__time">
          <span className="app__timeText">Please select time:</span>
          <select onChange={this.changeHour} value={this.state.selectedHour}>
            {
              hours.map(time => <option value={time} key={time}>{time}</option>)
            }
          </select>
        </div>
        <Grid>
          <Row>
            {
              nextDays
              .filter(item => item.dt_txt.split(' ')[1] === selectedHour)
              .map(day => {
                const { dt, weather = [], dt_txt, main = {}, wind = {} } = day;
                const { icon = '10d', description = 'empty description' } = weather[0];

                return (
                  <Col xs={12} sm={6} md={4} lg={4} key={dt}>
                    <WeatherCart
                      icon={`http://openweathermap.org/img/w/${icon}.png`}
                      iconDescription={description}
                      date={dt_txt.split(' ')[0]}
                      main={main}
                      wind={wind}
                    />
                  </Col>
                );
              })
            }
          </Row>
        </Grid>
      </section>
    );
  }
}

export default App;
