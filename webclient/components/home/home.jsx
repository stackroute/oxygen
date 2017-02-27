import React from 'react';
import {Link} from 'react-router';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Row, Col, Visible} from 'react-grid-system';

const styles = {
    title: {
        height: 400,
        margin: 0,
        background: '#009688',
        fontFamily: 'sans-serif'
    },
    center: {
        marginLeft: 70,
        marginRight: 70,
        paddingTop: 40
    },
    p: {
        marginTop: 0,
        fontSize: 80
    },
    link:{
      color: 'white',
      textDecoration: 'none'
    },
    container:{
      width:1130,
      marginTop:0,
      marginLeft: 100,
      marginRight: 100,
      fontFamily: 'sans-serif'
    }
};

export default class Home extends React.Component {

    displayTitle = () => {
        return (
            <div md={12} lg={12} sm={12} style={styles.title}>
                <center style={styles.center}>
                    <Link to={'/welcome'} style={styles.link}>
                        <img style={{width:200, height:200}} src={'../../assets/images/oxy.png'}/>
                        <p style={styles.p}>Oxygen 2.0</p>
                    </Link>
                </center>
            </div>
        );
    }

    displayCapabilities=()=>{
      return(
        <div md={12} lg={12} sm={12} style={styles.container}>
          <h1 style={{fontSize:36}}>Capabilities of Oxygen:</h1>
          <Row md={12} lg={12} sm={12}>
            <Col md={6} lg={4} sm={2}>
              <h3>Content Suggeston:</h3>
              <p>Suggests content for specified purpose and knowledge level</p>
            </Col>
            <Col md={6} lg={4} sm={2}>
              <h3>Indexing:</h3>
              <p>Indexes content to its usage based on purpose</p>
            </Col>
            <Col md={6} lg={4} sm={2}>
              <h3>Content Suggeston:</h3>
              <p>Suggests content for specified purpose and knowledge level</p>
            </Col>
          </Row>
        </div>
      );
    }

    render() {
        return (
            <div>
                {this.displayTitle()}
                {this.displayCapabilities()}
            </div>
        );
    }
}
