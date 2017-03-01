import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {Row, Col, Visible} from 'react-grid-system';

const styles = {
    title: {
        width:'100%',
        height: 400,
        margin: 0,
        background: '#009688',
        fontFamily: 'Georgia',
        fontWeight: 'normal'
    },
    h1:{
      fontSize:200,
      margin:0,
      textAlign:'center',
      color:'white',
      fontWeight: 'normal'
    },
    h3:{
      textAlign:'center',
      color:'#7f8c8d'
    },
    p: {
        marginTop: 0,
        textAlign:'justify',
        color:'#7f8c8d'
    },
    container:{
      marginTop:0,
      marginLeft: 50,
      marginRight: 50,
      fontFamily: 'sans-serif'
    },
    img:{margin:32},
    button:{color:'white', backgroundColor:'#F39C12', fontWeight:'bold', fontFamily: 'Georgia'}
};

export default class Home extends React.Component {

    displayTitle = () => {
        return (
            <div style={styles.title}>
              <Col lg={12} md={12} sm={12} xs={12}>
                <h1 style={styles.h1}>O</h1>
                <h1 style={{color:'white', fontSize:80, margin:0, textAlign:'center'}}>Oxygen 2.0</h1>
                <br/>
                  <center><FlatButton label='Start Breathing...' primary={false} containerElement= {<Link to = {'/Welcome'}/>} style={styles.button}/></center>
              </Col>
            </div>
        );
    }

    displayCapabilities=()=>{
      return(
        <div style={styles.container}>
          <Row md={12} lg={12} sm={12} xs={12}>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/suggestion.png'></img></center>
              <h3 style={styles.h3}>Content Suggestion</h3>
              <p style={styles.p}>Suggests content for specified purpose and knowledge level.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/indexing.png'></img></center>
              <h3 style={styles.h3}>Indexing</h3>
              <p style={styles.p}>Indexes the content to its usage based on purpose and also based on ontology.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/buildandtrain.png'></img></center>
              <h3 style={styles.h3}>Build and train ontology</h3>
              <p style={styles.p}>Build and train the ontology of a particular domain using Ontology Trainer.</p>
            </Col>
          </Row>
          <br/>
          <Row md={12} lg={12} sm={12}>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/visualize.png'></img></center>
              <h3 style={styles.h3}>Visualize ontology</h3>
              <p style={styles.p}>View the ontology or the structure of a particular domain an it's corresponding resources.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/autosource.png'></img></center>
              <h3 style={styles.h3}>Auto Sourcing</h3>
              <p style={styles.p}>Documents of a particular domain are sourced automatically when that domain is added.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/scalability.png'></img></center>
              <h3 style={styles.h3}>Highly Scalable</h3>
              <p style={styles.p}>Oxygen is capable of handling high data rate and also huge number of web documents.</p>
            </Col>
          </Row>
          <br/>
          <Row>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/crawling.png'></img></center>
              <h3 style={styles.h3}>Focussed Crawling</h3>
              <p style={styles.p}>Captures the meaning of web documents by extracting the semantic importance of the words in them.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/feed.png'></img></center>
              <h3 style={styles.h3}>Feed URLs manually</h3>
              <p style={styles.p}>Manual add URLs of the documents that you wish to add.</p>
            </Col>
            <Col md={4} lg={4} sm={12} xs={12}>
              <center><img style={styles.img} src='../../assets/images/landingpage/export.png'></img></center>
              <h3 style={styles.h3}>Export data to RDF</h3>
              <p style={styles.p}>Easily export data to RDF, which is the widely used data schema.</p>
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
