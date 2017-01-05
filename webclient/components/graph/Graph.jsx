import React from 'react';
import AutoCompleteSearchBox from './AutoCompleteSearchBox';
import SelectPanel from './SelectPanel';
import DocResultCard from './DocResultCard';
import SelectedConcepts from './SelectedConcepts';
import {Row, Col, ScreenClassRender, Visible} from 'react-grid-system';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import IconButton from 'material-ui/IconButton';
import Request from 'superagent';
import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
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
  color: '#1976d2'
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
  if (screenClass === 'xl') {return { fontSize: '37px', textAlign: 'left', color: '#8aa6bd' };}
  if (screenClass === 'lg') {return { fontSize: '35px', textAlign: 'left', color: '#8aa6bd' };}
  if (screenClass === 'md') {return { fontSize: '30px', textAlign: 'left', color: '#8aa6bd' };}
  if (screenClass === 'sm') {return { fontSize: '28px', textAlign: 'left', color: '#8aa6bd' };}
  return { fontSize: '25px', textAlign: 'left', color: '#8aa6bd' };
};

// const imgStyle = (screenClass) => {
//   if (screenClass === 'xl') {return { width: '500px', height: 'auto' };}
//   if (screenClass === 'lg') {return { width: '400px', height: 'auto'};}
//   if (screenClass === 'md') {return { width: '400px', height: 'auto' };}
//   if (screenClass === 'sm') {return { width: '400px', height: 'auto' };}
//   return { width: '300px', height: 'auto'};
// };

// const divStyle = (screenClass) => {
//   if (screenClass === 'xl') {return { width: '500px', margin: '0 auto auto' };}
//   if (screenClass === 'lg') {return { width: '400px', margin: '0 auto auto' };}
//   if (screenClass === 'md') {return { width: '400px', margin: '0 auto auto' };}
//   if (screenClass === 'sm') {return { width: '400px', margin: '0 auto auto' };}
//   return { width: '300px', margin: '0 auto auto'};
// };

// class ShowImg extends React.Component {

//   constructor(props) {
//     super(props);
//   }
//   render() {
//    return(<ScreenClassRender style={divStyle}>
//     <div>
//     <ScreenClassRender style={imgStyle}>
//     <img src = {'./../assets/images/' + this.props.imgName} />
//     </ScreenClassRender>
//     </div>
//     </ScreenClassRender>);
//  }
// } <ShowImg imgName={this.state.msgSelector} />
export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgSelector: 'No search specified',
      domainName: '',
      concepts: [],
      conceptsOnly: [],
      intents: [],
      docs: [],
      checkedIntent: [],
      selectedConcept: [],
      open: false,
      pageNum: 1
    };
  }
  handleToggle = () => this.setState({open: !this.state.open});
  getConcepts(conceptWithDocCnt)
  {
    let sepDoc = conceptWithDocCnt.split(' (');
    let concept = sepDoc[0];
    let newConcepts = this.state.selectedConcept;
    if(this.state.conceptsOnly.includes(concept))
    {
      if(!newConcepts.includes(concept)) {
        newConcepts.push(concept);
      }
    }

    this.setState({
      selectedConcept: newConcepts
    });
    // console.log('selected concept')
    // console.log(newConcepts)
  }

  getCheckedIntents(event, checked)
  {
    let prevIntents = this.state.checkedIntent;
    if(checked) {
      prevIntents.push(event.target.value);
    }
    else {
      prevIntents = prevIntents.filter(function(data) {
        return data !== event.target.value;
      });
    }
    this.setState({
      checkedIntent: prevIntents
    });
  }
  deleteConcepts(data) {
    let delConcepts = this.state.selectedConcept;
    delConcepts = delConcepts.filter(function(concept) {
     return concept !== data;
   });
    this.setState(
    {
      selectedConcept: delConcepts
    });
    // console.log(delConcepts)
  }
  getIntentsAndConcepts()
  {
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
       that.setState(
       {
        domainName: domainDetails.Domain,
        concepts: domainDetails.ConceptsWithDoc,
        intents: domainDetails.Intents,
        conceptsOnly: conOnly
      });
     }
   });
  }
  searchDocuments()
  {
    if(this.state.selectedConcept.length === 0)
    {
      this.setState({
        msgSelector: 'No documents found for specified concepts and/or intent...!',
        docs: []
      });
    }
    else{
      let reqObj = {
        domainName: this.state.domainName,
        reqIntents: this.state.checkedIntent,
        reqConcepts: this.state.selectedConcept
      };
      reqObj.allIntents = this.state.intents;
      if(reqObj.reqIntents.length === 0)
      {
        reqObj.reqIntents = [];
      }
      this.setState({
        docs: []
      });
      // console.log('sending the data to fetch documents')
      // console.log(reqObj)
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
    // console.log('Response on documents to show: ',response);
    response.sort(function(a, b) {
      return (Number(b.intensity) - Number(a.intensity));
    });
    if(typeof response === 'undefined' || response.length === 0)
    {
      this.setState({
        msgSelector: 'No documents found for specified concepts and/or intent...!'
      });
    }
    this.setState({
      docs: response
    });
  }
});
    }
  }
  componentDidMount()
  {
   this.getIntentsAndConcepts();
 }
 onPageClick(e)
 {
   let page = this.state.pageNum;
   if(e.currentTarget.dataset.id === 'prev')
   {
     page -= 1;
     this.setState({pageNum: page});
   }
   else
   {
     page += 1;
     this.setState({pageNum: page});
   }
 }
 render()
 {
   let list = [];
   let prevFlag;
   let nextFlag;
   let dList = this.state.docs;
   let docsPerImg = 5;
   if(dList.length > 0)
   {
     let pages = Math.ceil(dList.length / docsPerImg);
     // console.log('pages '+pages);
     let pageNow = this.state.pageNum;
     // console.log('pageNow '+pageNow);
     if(pages === pageNow)
     {
       nextFlag = true;
     }
     if(this.state.pageNum === 1)
     {
       prevFlag = true;
     }
     if(pages === 1 || pages === pageNow)
     {

      list = [];
      // console.log(list);
      for(let i = docsPerImg * (pageNow - 1); i < this.state.docs.length; i += 1)
      {
       list.push(this.state.docs[i]);
     }
       // console.log('printing list in if '+list);
     }
     else {
       list = [];
       let foo = docsPerImg * (pageNow - 1);
       for(let i = foo; i < (foo + docsPerImg); i += 1)
       {
         list.push(this.state.docs[i]);
       }

      // console.log('printing list in else'+list);
    }
  }
  return(
   <div style={fonts}>
   <Row style={{margin: 0}}>
   <Visible lg xl>
   <Col sm={12} xs={12} md={2} lg={2} xl={2} style={iPanel}>
   <SelectPanel intents={this.state.intents}
   getCheckedIntent={this.getCheckedIntents.bind(this)}/>
   </Col>
   <Col sm = {12} xs = {12} md = {10} lg = {10} xl = {10}
   style = {{maxWidth: 2000, marginLeft: '16.5%'}}>
   <Row>
   <Col lg={12} md={12} sm={12} xs={12}>
   <ScreenClassRender style = {styleFunction}>
   <h1>
   { this.state.domainName.toUpperCase() }
   </h1>
   </ScreenClassRender>
   </Col>
   </Row>
   <Row>
   <Col sm={12} xs={12} md={12} lg={12} xl={12}>
   <AutoCompleteSearchBox concepts={this.state.concepts}
   searchDocument={this.searchDocuments.bind(this)}
   getConcept={this.getConcepts.bind(this)}/>
   <Row>
   <Col md={12} lg={12} xl={12}>
   {
    this.state.selectedConcept.length===0?<h4 style={{color:'#8aa6bd'}}>PLEASE SELECT CONCEPTS</h4>:
    <SelectedConcepts conceptChips={this.state.selectedConcept}
    deleteConcept={this.deleteConcepts.bind(this)} />}
    </Col>
    </Row>
    </Col>
    </Row>
    <br/><br/>
    <Row>
    <Col md={12} lg={12} xl={12} style={{marginTop:'-20px'}}>
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
    <Visible style={{padding:0}} md sm xs>


    <Drawer open={this.state.open}
    onRequestChange={this.handleToggle}
    docked={false}
    >

    <MenuItem><SelectPanel intents={this.state.intents}
    getCheckedIntent={this.getCheckedIntents.bind(this)}/></MenuItem>
    </Drawer>

    <Col sm={12} xs={12} md={12} style={{maxWidth:2000}}>
    <Row>
    <Col md={10} sm={10} xs={10}>
    <ScreenClassRender style={styleFunction}>
    <h1>
    {this.state.domainName.toUpperCase()}
    </h1>
    </ScreenClassRender>
    </Col>
    <Col md={2} sm={2} xs={2}>
    <IconButton iconStyle={styles.largeIcon} onTouchTap={this.handleToggle} >
    <NavigationMenu style={styles.large} color={'white'} />
    </IconButton>
    </Col>
    </Row>
    <Row>
    <Col sm={12} xs={12} md={12}>
    <AutoCompleteSearchBox concepts={this.state.concepts}
    searchDocument={this.searchDocuments.bind(this)}
    getConcept={this.getConcepts.bind(this)}/>
    <Row>
    <Col sm={12} xs={12} md={12}>
    {
      this.state.selectedConcept.length===0?
      <h4 style={{color:'#8aa6bd'}}>PLEASE SELECT CONCEPTS</h4>:
      <SelectedConcepts conceptChips={this.state.selectedConcept}
      deleteConcept={this.deleteConcepts.bind(this)} />}
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
Graph.propTypes = {
  params: React.PropTypes.object

};

// ShowImg.propTypes = {
//   imgName: React.PropTypes.string

// };
