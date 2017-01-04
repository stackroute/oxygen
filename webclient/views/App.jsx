import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue400, blue700} from 'material-ui/styles/colors';
import Oxygen, {Welcome} from '../components/welcome/';
import JobResult, {Job} from '../components/job/';
import Dashboard from '../components/dashboard/';
import Graph from '../components/graph';
import Domainhomeview from '../components/domainhomeview';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    textColor: blue700,
    primary1Color: blue400,
    primary2Color: blue700
  },
  appBar: {
    height: 50
  }
});

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
  <Router history = {hashHistory}>
  <Route path = "/" component = {Oxygen}/>
  <Route path = "/welcome" component = {Welcome}>
  <IndexRoute component = {Dashboard}/>
  <Route path = "/job" component = {Job}/>
  <Route path = "/jobResult/:jobID" component = {JobResult}/>
  <Route path = "/dashboard" component = {Dashboard}/>
  <Route path = "/graph/:domainName" component = {Graph}/>
  <Route path = "/domainhomeview/:domainName" component= {Domainhomeview} />
  </Route>
  </Router>
  </MuiThemeProvider>,
  document.getElementById('search')
  );
