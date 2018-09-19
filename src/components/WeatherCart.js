import React, { Component } from 'react';
import { Row, Col, Grid, Fade } from 'react-bootstrap';

export default props => {
  const { iconDescription, icon, date, main, wind } = props;

  const convertTemperature = temp => {
    return Math.round((temp - 272.15) * 100) / 100;
  }

  const tempKeysArray = Object.keys(main).filter(key => {
    return key.indexOf('temp') !== -1 && key !== 'temp' && key !== 'temp_kf'
  });

  const humidityKeyArray = [];
  const pressureKeyArray = ['sea_level'];
  const windKeyArray = ['deg'];

  return (
    <div className="weatherCart">

      <section>
        <h3 className="weatherCart__title">{date} <img className="weatherCart__icon" src={icon} alt={iconDescription} /></h3>
        <Section
          convertMethod={convertTemperature}
          titleLabel={'Temperature'}
          titleValue={main.temp}
          sectionValuesKeys={tempKeysArray}
          main={main}
        />
        <Section
          titleLabel={'Pressure'}
          titleValue={main.pressure}
          sectionValuesKeys={pressureKeyArray}
          main={main}
        />
        <Section
          titleLabel={'Wind speed'}
          titleValue={wind.speed}
          sectionValuesKeys={windKeyArray}
          main={wind}
        />
        <Section
          titleLabel={'Humidity'}
          titleValue={main.humidity}
          sectionValuesKeys={humidityKeyArray}
          main={main}
        />
      </section>
    </div>
  )
};

class Section extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.toggleSection = this.toggleSection.bind(this);
  }

  toggleSection() {
    this.setState({open: !this.state.open})
  }

  render() {
    const {titleLabel, titleValue, main, sectionValuesKeys, convertMethod} = this.props;
    const { open } = this.state;

    return (
      <section>
        <h4 className="weatherCart__marginLeft">{`${titleLabel}: ${convertMethod ? convertMethod(titleValue) : titleValue}`}
          {
            sectionValuesKeys.length
            ? <span className="weatherSection__toggle" onClick={() => this.toggleSection()}>{open ? 'hide' : 'show more'}</span>
            : null
          }
        </h4>
        {
        sectionValuesKeys.length
        ? <Fade in={open}>
            <Grid fluid>
              <Row>
                {
                  sectionValuesKeys.map(key => (
                    <Col key={key} xs={6}>
                      <p >{`${key.replace('_', ' ')}: ${convertMethod ? convertMethod(main[key]) : main[key]}`}</p>
                    </Col>
                  ))
                }
              </Row>
            </Grid>
          </Fade>
        : <Grid fluid>
            <Row>
              {
                sectionValuesKeys.map(key => (
                  <Col key={key} xs={6}>
                    <p >{`${key.replace('_', ' ')}: ${convertMethod ? convertMethod(main[key]) : main[key]}`}</p>
                  </Col>
                ))
              }
            </Row>
          </Grid>
        }
      </section>
    );
  }
};
