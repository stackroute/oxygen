
import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {grey500,blue700,green800,red600,purple500,deepOrange500,teal500,Teal900,indigo700,purple400,Red900, grey100, cyan500, cyan700, lightBlack, pinkA200, deepPurpleA700, white, grey300} from 'material-ui/styles/colors';
import Welcome from '../components/welcome/';
import JobResult, {Job} from '../components/job/';
import Crawler from '../components/crawler/';
import Dashboard from '../components/dashboard/';
import SubjectNode from '../components/editor/';
import Graph from '../components/graph';
import DomainHome from '../components/domainhome';
//import Colors from 'material-ui/lib/styles/colors';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {

    primary1Color:green800,
    primary2Color:green800,
  accent1Color:red600,
    textColor:red600,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: Red900,
  //  disabledColor: ColorManipulator.fade(Colors.darkBlack, 0.3),
    pickerHeaderColor: grey500,



  },
  appBar: {
    height: 50
  },
  menuItem: {
    selectedTextColor: Red900,
  },
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
  <Router history = {hashHistory}>
  <Route path = "/" component = {Welcome}>
  <IndexRoute component = {Dashboard}/>
  <Route path = "/job" component = {Job}/>
  <Route path = "/crawl" component = {Crawler}/>
  <Route path = "/jobResult/:jobID" component = {JobResult}/>
  <Route path = "/dashboard" component = {Dashboard}/>
  <Route path = "/edit/:domainName" component = {SubjectNode}/>
  <Route path = "/graph/:domainName" component = {Graph}/>
  <Route path = "/domainhome/:domainName" component= {DomainHome} />
  </Route>
  </Router>
  </MuiThemeProvider>,
  document.getElementById('search')
  );
