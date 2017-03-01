import React from 'react';
import AutoCompleteConceptSearch from './AutoCompleteConceptSearch';
import AutoCompleteIntentSearch from './AutoCompleteIntentSearch';
import DocResultCard from './DocResultCard';
import SelectedConcepts from './SelectedConcepts';
import SelectedIntents from './SelectedIntents';
import SunburstView from './SunburstView';
import {Row, Col, ScreenClassRender, Visible} from 'react-grid-system';
import Request from 'superagent';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import {Tabs, Tab} from 'material-ui/Tabs';
import ImageEdit from 'material-ui/svg-icons/image/edit';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
// import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

  const iPanel = {
    minWidth: 150,
    backgroundColor: '#dadada',
    minHeight: 4000,
    position: 'fixed'
  };
  const fonts = {
    margin: 0,
    textAlign: 'center',
    fontFamily: 'sans-serif',
    color: 'rgb(0,128, 128)'
  };
  const iconStyle = {
      iconSize: {

          width: 30,
          height: 30,
          backgroundColor: '#a9a9a9',
          padding: 10,
          borderRadius: 60
      },
      large: {
          width: 120,
          height: 120,
          padding: 30
      },
      leftIcon:{
          position:'relative',
          marginLeft:'4%',
          float:'left'
      },
      rightIcon:{
          position:'relative',
          marginRight:'5%',
          float:'right'
      },
      leftIconAvg:{
          position:'relative',
          margin:'10 0 0 ',
          padding:0,
          zDepth:10,
          float:'left'
      },
      rightIconAvg:{
          position:'relative',
          margin:'10 0 0 ',
          padding:0,
          zDepth:10,
          float:'right'

      }
  };
  const styles = {
    largeIcon: {
      width: 28,
      height: 28,
      backgroundColor: '#a9a9a9',
      padding: 10,
      borderRadius: 60
    },
    large: {
      width: 120,
      height: 120,
      padding: 30
    }
  };
  const styleFunction = (screenClass) => {
    if (screenClass === 'xl') {return { fontSize: '37px', textAlign: 'left', color: 'rgb(0,128, 128)' };}
    if (screenClass === 'lg') {return { fontSize: '35px', textAlign: 'left', color: 'rgb(0,128, 128)' };}
    if (screenClass === 'md') {return { fontSize: '30px', textAlign: 'left', color: 'rgb(0,128, 128)' };}
    if (screenClass === 'sm') {return { fontSize: '28px', textAlign: 'left', color: 'rgb(0,128, 128)' };}
    return { fontSize: '25px', textAlign: 'left', color: 'rgb(0,128, 128)' };
  };

export default class DomainHomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgSelector: 'No search specified',
      domainName: '',
      concepts: [],
      conceptsOnly: [],
      intents: [],
      docs: [],
      selectedIntent: [],
      selectedConcept: [],
      selectedConceptText: '',
      selectedIntentText: '',
      open: false,
      show:0,
      pageNum: 1
    };
  }

  //handleActive = () => this.setState({open: !this.state.open});
  // handleToggle = () => this.setState({open: !this.state.open});
  getConcepts(conceptWithDocCnt) {
    let sepDoc = conceptWithDocCnt.split(' (');
    let concept = sepDoc[0];
    let newConcepts = this.state.selectedConcept;
    if(this.state.conceptsOnly.includes(concept)) {
      if(!newConcepts.includes(concept)) {
        newConcepts.push(concept);
      }
    }

    this.setState({
      selectedConcept: newConcepts
    });
  }

  sunSelectedConcept(conceptName){
    console.log('In sunSelectedConcept');
    this.state.selectedConcept.push(conceptName);
    this.setState({selectedConceptText: conceptName});
    this.searchDocuments();
  }
  voiceConceptInput(conceptName) {
    this.state.selectedConcept.push(conceptName);
    this.setState({selectedConceptText: conceptName});
  }
  voiceIntentInput(intentName) {
    this.state.selectedIntent.push(intentName);
    this.setState({selectedIntentText: intentName});
  }
  getIntents(conceptWithDocCnt) {
    let sepDoc = conceptWithDocCnt.split(' (');
    let intent = sepDoc[0];
    let prevIntents = this.state.selectedIntent;
    if(this.state.intents.includes(intent)) {
      if(!prevIntents.includes(intent)) {
        prevIntents.push(intent);
      }
    }
  // getCheckedIntents(event, checked) {
  //   let prevIntents = this.state.checkedIntent;
  //   if(checked) {
  //     prevIntents.push(event.target.value);
  //   }

    // getCheckedIntents(event, checked)
    // {
    //     let prevIntents = this.state.checkedIntent;
    //     if(checked) {
    //       prevIntents.push(event.target.value);
    //     }
    //     else {
    //         prevIntents = prevIntents.filter(function(data) {
    //             return data !== event.target.value;
    //         });
    //     }
    //     this.setState({
    //         checkedIntent: prevIntents
    //     });
    // }
    this.setState({
      selectedIntent: prevIntents
    });
  }

  deleteConcepts(data) {
    let delConcepts = this.state.selectedConcept;
    delConcepts = delConcepts.filter(function(concept) {
     return concept !== data;
    });
    this.setState({
      selectedConcept: delConcepts
    });
  }
  deleteIntents(data) {
    let delIntents = this.state.selectedIntent;
    delIntents = delIntents.filter(function(intents) {
     return intents !== data;
    });
    this.setState({
      selectedIntent: delIntents
    });
  }
  getIntentsAndConcepts() {
    let url = `/domain/` + this.props.params.domainName;
    let that = this;
    Request
    .get(url)
    .end((err, res) => {
      if(!err) {
        let domainDetails = JSON.parse(res.text);
        console.log('received concepts and intent for the current domain')
        console.log(domainDetails)
        let conOnly = [];
        domainDetails.ConceptsWithDoc.map(function(conceptWithDocCnt) {
          let sepDoc = conceptWithDocCnt.split(' (');
          conOnly.push(sepDoc[0]);
        });
        console.log('extracted concepts :')
        console.log(conOnly);
        that.setState({
          domainName: domainDetails.Domain,
          concepts: domainDetails.ConceptsWithDoc,
          intents: domainDetails.Intents,
          conceptsOnly: conOnly
        });
      }
    });
  }
  searchDocuments() {
    if(this.state.selectedConcept.length === 0) {
      this.setState({
        msgSelector: 'No documents found for specified concepts and/or intent...!',
        docs: []
      });
      let msg = new SpeechSynthesisUtterance(this.state.msgSelector);
      window.speechSynthesis.speak(msg);
    }
    else {
      let reqObj = {
        domainName: this.state.domainName,
        reqIntents: this.state.selectedIntent,
        reqConcepts: this.state.selectedConcept
      };
      reqObj.allIntents = this.state.intents;
      if(reqObj.reqIntents.length === 0) {
        reqObj.reqIntents = [];
      }
      this.setState({
        docs: []
      });
      let url = `/domain/documents/`+reqObj.domainName;
      Request
        .post(url)
        .send(reqObj)
        .end((err, res) => {
          if(err) {
         // res.send(err);
         // console.log(err)
          }
          else {
            let response = JSON.parse(res.text);
            console.log('Response on documents to show: ',response);
            if(typeof response === 'undefined' || response.length === 0) {
              response.sort(function(a, b) {
                return (Number(b.intensity) - Number(a.intensity));
              });
              this.setState({
                msgSelector: 'No documents found for specified concepts and/or intent...!'
              });
              let msg = new SpeechSynthesisUtterance(this.state.msgSelector);
              window.speechSynthesis.speak(msg);
            } else {
              let msg = new SpeechSynthesisUtterance(response.length+' results found to your given input');
              window.speechSynthesis.speak(msg);
            }
            this.setState({
              docs: response
            });
          }
      });
    }
  }
  componentDidMount() {
   this.getIntentsAndConcepts();
  }

  componentWillMount() {
    selectedConceptName.onNewSelect = (clickedConceptName) => {
      console.log('On outside variable change ', clickedConceptName);
      this.sunSelectedConcept(clickedConceptName);
    };
  }
  onPageClick(e) {
    let page = this.state.pageNum;
    if(e.currentTarget.dataset.id === 'prev') {
      page -= 1;
      this.setState({pageNum: page});
    }
    else {
      page += 1;
      this.setState({pageNum: page});
    }
  }
  render() {
    let list = [];
    let prevFlag;
    let nextFlag;
    let dList = this.state.docs;
    let docsPerImg = 5;
    let showSunburst = null;
    if(dList.length > 0) {
      let pages = Math.ceil(dList.length / docsPerImg);
      // console.log('pages '+pages);
      let pageNow = this.state.pageNum;
     // console.log('pageNow '+pageNow);
      if(pages === pageNow) {
        nextFlag = true;
      }
      if(this.state.pageNum === 1) {
        prevFlag = true;
      }
      if(pages === 1 || pages === pageNow) {
        list = [];
        // console.log(list);
        for(let i = docsPerImg * (pageNow - 1); i < this.state.docs.length; i += 1) {
          list.push(this.state.docs[i]);
        }
       // console.log('printing list in if '+list);
      }
      else {
        list = [];
        let foo = docsPerImg * (pageNow - 1);
        for(let i = foo; i < (foo + docsPerImg); i += 1) {
         list.push(this.state.docs[i]);
        }
        // console.log('printing list in else'+list);
      }
    }
    console.log(this.state.selectedConceptText);
    if(this.state.domainName.length >= 1) {
      showSunburst = <Row style={{padding:"0 20px"}}>
                        <Col sm={12} md={12} lg={12} xl={12} style={{marginLeft:0}} >
                          <SunburstView domainName={this.state.domainName}
                              sunSelectedConcept={(conceptName) => this.sunSelectedConcept(conceptName)}/>
                        </Col>
                      </Row>
    }
    return(
      <div style={fonts}>
        <Row style={{margin: 0}}>
          <Visible style={{padding:0}} md sm xs lg xl>
            <Col sm={12} xs={12} md={12} style={{maxWidth:2000}}>
              <Row>
                <Col md={10} sm={10} xs={10}>
                  <ScreenClassRender style={styleFunction}>
                    <h1>
                      {this.state.domainName}

                    <FlatButton label='Edit' primary={true} containerElement = {<Link to={'/edit/'+ this.state.domainName}/>} style={{
                            float: 'right'
                        }}/>
                    <FlatButton label='Graph View' primary={true} containerElement = {<Link to = {'/domainview/'+this.state.domainName}/>} style={{
                            float: 'right'
                        }}/>
                    </h1>

                  </ScreenClassRender>

                </Col>
              </Row>
              <div id="main">
                <div id="sequence"></div>
                <div id="chart">
                  <div id="explanation">
                    <span id="courseName"></span><br/>
                  </div>
                </div>
              </div>

              {//showSunburst
              }
              <Row style={{padding:"0 20px"}}>
                 <Col sm={6} xs={12} md={6} style={{float:'left'}}>
                    <AutoCompleteConceptSearch concepts={this.state.concepts}
                      searchDocument={this.searchDocuments.bind(this)}
                      getConcept={this.getConcepts.bind(this)}
                      searchText={this.state.selectedConceptText}
                      voiceConceptInput={(conceptName) => this.voiceConceptInput(conceptName)}/>
                      <Row>
                        <Col sm={12} xs={12} md={12}>
                          {
                            this.state.selectedConcept.length===0?
                            <h4 style={{color:'#8aa6bd'}}></h4>:
                            <SelectedConcepts conceptChips={this.state.selectedConcept}
                            deleteConcept={this.deleteConcepts.bind(this)} />
                          }
                        </Col>
                      </Row>
                 </Col>
                <Col sm={6} xs={12} md={6} style={{float:'right'}}>
                  <AutoCompleteIntentSearch intents={this.state.intents}
                    searchDocument={this.searchDocuments.bind(this)}
                    getIntent={this.getIntents.bind(this)}
                    searchText={this.state.selectedIntent}
                    voiceIntentInput={(intentName) => this.voiceIntentInput(intentName)} />
                    <Row>
                      <Col sm={12} xs={12} md={12}>
                        {
                          this.state.selectedIntent.length===0?
                          <h4 style={{color:'#8aa6bd'}}></h4>:
                          <SelectedIntents intentChips={this.state.selectedIntent}
                          deleteIntent={this.deleteIntents.bind(this)} />
                        }
                      </Col>
                    </Row>
                </Col>
              </Row>
              <br/><br/>
              <Row>
                <Col sm={12} xs={12} md={12} style={{marginTop:'-20px'}}>
                  {
                    list.length===0?
                    <h1 style={{marginTop:'15%',color:'#8aa6bd'}}>{this.state.msgSelector}</h1>:
                    <div>
                      {
                        list.map((doc,i)=>{return <DocResultCard key={i} webDoc={doc}/>})
                      }
                      <Col md={12} lg={12} xl={12}>
                        <IconButton style={iconStyle.leftIcon} label='prev' disabled={prevFlag} data-id='prev'
                          iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
                          <NavigationArrowBack style={iconStyle.large} color={'white'} />
                        </IconButton>
                        <IconButton style={iconStyle.rightIcon} label='next' disabled={nextFlag} data-id='next'
                          iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
                          <NavigationArrowForward style={iconStyle.large} color={'white'} />
                        </IconButton>
                      </Col>
                    </div>
                  }
                </Col>
              </Row>
            </Col>
          </Visible>
        </Row>
      </div>
    );
  }
}

DomainHomeView.propTypes = {
    params: React.PropTypes.object
};
