import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
    grey500,
    lime900,
    lime800,
    blue700,
    deepOrange500,
    amber500,
    teal500,
    teal900,
    indigo700,
    purple400,
    red900,
    grey100,
    cyan500,
    cyan700,
    lightBlack,
    pinkA200,
    deepPurpleA700,
    white,
    grey300,
    fullBlack,
    grey400,darkBlack
} from 'material-ui/styles/colors';
import Welcome from '../components/welcome/';
import Home from '../components/home';
import JobResult, {Job} from '../components/job/';
import Crawler from '../components/crawler/';
import Dashboard from '../components/dashboard/';
import SubjectNode from '../components/editor/';
import Graph from '../components/graph';
import DomainHome from '../components/domainhome';
import DomainView from '../components/domainview/DomainView';

import {Router, Route, IndexRoute, hashHistory} from 'react-router';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {

      primary1Color: teal500,
       primary2Color: indigo700,
       primary3Color: grey400,
       accent1Color: indigo700,
       accent2Color: grey100,
       accent3Color: grey500,
       textColor: darkBlack,
       alternateTextColor: white,
       canvasColor: white,
       borderColor: grey300,
       disabledColor: grey300,
       pickerHeaderColor: indigo700,
       clockCircleColor: indigo700,
       shadowColor: fullBlack

    },
    appBar: {
        height: 50
    }
});

ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={hashHistory}>
        <Route path="/" component={Home}/>
        <Route path = "/welcome" component = {Welcome}>
            <IndexRoute component={Dashboard}/>
            <Route path="/job" component={Job}/>
            <Route path="/crawl" component={Crawler}/>
            <Route path="/jobResult/:jobID" component={JobResult}/>
            <Route path="/dashboard" component={Dashboard}/>
            <Route path='/domainview/:domainName' component={DomainView}/>
            <Route path="/edit/:domainName" component={SubjectNode}/>
            <Route path="/graph/:domainName" component={Graph}/>
            <Route path="/domainhome/:domainName" component={DomainHome}/>
        </Route>
    </Router>
</MuiThemeProvider>, document.getElementById('search'));
