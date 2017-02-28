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
            <div style={styles.title}>
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
        <div style={styles.container}>
          <h1 style={{fontSize:36}}>Capabilities of Oxygen:</h1>
          <Row md={12} lg={12} sm={12}>
            <Col md={6} lg={4} sm={6}>
              <h3>Content Suggeston:</h3>
              <p>Suggests content for specified purpose and knowledge level.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Indexing</h3>
              <p>Indexes the content to its usage based on purpose and also based on ontology.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Build and train ontology</h3>
              <p>Build and train the ontology of a particular domain using Ontology Trainer.</p>
            </Col>
          </Row>
          <br/>
          <Row md={12} lg={12} sm={12}>
            <Col md={6} lg={4} sm={6}>
              <h3>Visualize ontology</h3>
              <p>View the ontology or the structure of a particular domain an it's corresponding resources.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Auto Sourcing</h3>
              <p>Documents of a particular domain are sourced automatically when that domain is added.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Highly Scalable</h3>
              <p>Oxygen is capable of handling high data rate and also huge number of web documents.</p>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col md={6} lg={4} sm={6}>
              <h3>Focussed Crawling</h3>
              <p>Captures the meaning of web documents by extracting the semantic importance of the words in them.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Feed URLs manually</h3>
              <p>Manual add URLs of the documents that you wish to add.</p>
            </Col>
            <Col md={6} lg={4} sm={6}>
              <h3>Export data to RDF</h3>
              <p>Easily export data to RDF, which is the widely used data schema.</p>
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
