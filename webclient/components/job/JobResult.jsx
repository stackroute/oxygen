import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import CardResult from './CardResult.jsx';
import {Container, Row, Col} from 'react-grid-system';
const fonts={
  margin: "0px auto",
  textAlign: "center",
  fontFamily: "sans-serif",
  color: "#1976d2",
  width:"700px"
}
export default class JobResult extends React.Component {
  constructor(props) {
    super(props)
    this.state={searchResult:[],query:""}
    this.searchDetails=this.searchDetails.bind(this)
  }
  searchDetails() {
    console.log(this.props.params.jobID);
   let url =`http://localhost:8081/searchJobResult/${this.props.params.jobID}`;
   let that = this;
   Request
   .get(url)
   .end(function(err, res){
     console.log(res);
    let data=JSON.parse(res.text);
    that.setState({
      searchResult:data.searchResults,
      query:data.query
    });
  });
 }
 componentWillMount()
 {
  this.searchDetails();
 }
render()
{

  return(
    <div style={fonts}>
      <Container>
    <Link to="/job">
    <FlatButton label="Go Back to Job Page"
    style={{fontSize:"50px",marginTop:"4px"}}/>
    </Link>
    <h1>Here are the search results for {this.state.query}</h1>
    {this.state.searchResult.map((searchItem,i) =>
      <CardResult  key={i} searchItem={searchItem} />
      )}
    </Container>
    </div>
    );
}
}
