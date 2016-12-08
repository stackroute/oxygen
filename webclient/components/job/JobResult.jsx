import React from 'react';
import {Link} from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import Request from 'superagent';
import CardResult from './CardResult.jsx';
import {Container} from 'react-grid-system';
import RefreshIndicator from 'material-ui/RefreshIndicator';
// require('rc-pagination/assets/index.css');
// import  Pagination from 'rc-pagination';
//  <Pagination  style={styles.chip} defaultCurrent={3} total={this.state.searchResult.length}>
// </Pagination>

const style = {
 refresh: {
   marginTop:'200px',
   display: 'inline-block',
   position: 'relative'
 }
};

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
    this.state={searchResult:[],query:"",loading:"loading"}
    this.searchDetails=this.searchDetails.bind(this)
  }
  searchDetails() {
    console.log(this.props.params.jobID);
    let url =`http://localhost:8081/searchJobResult/${this.props.params.jobID}`;
    let that = this;
    Request
    .get(url)
    .end(function(err, res){     
     let data=JSON.parse(res.text);
     console.log(data);
     let word="";
     data.content.map((item)=>{word=item.query})
     that.setState({
      searchResult:data.content,
      query:word,
      loading:"hide"
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

     {this.state.loading==="loading"?<RefreshIndicator
     size={70}
     left={10}
     top={0}
     status={this.state.loading}
     style={style.refresh}
     />:<div>{this.state.searchResult.map((searchItem,i) =>
       <CardResult key={i} searchItem={searchItem} />
       )}</div>}
     </Container>
     </div>
     );
  }
}
JobResult.propTypes = {  
  params: React.PropTypes.object
}