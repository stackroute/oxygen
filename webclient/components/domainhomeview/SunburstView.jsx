import React from 'react';
import Request from 'superagent';
import Paper from 'material-ui/Paper';

export default class SunburstView extends React.Component {
  constructor(props) {
      super(props);
      //@todo create properties
      // selected concept
      // domain name
      // selected node
    }

    getTreeofDomain(){
      let url = `/domain/domainhomeview/` + this.props.domainName;
      let that = this;
      Request
      .get(url)
      .end((err, res) => {
       if(!err) {
         let domainTree = JSON.parse(res.text);
         console.log('domainTree: ',res.text)
        
         that.setState(
         {
          domainName: domainTree.Domain
        });
       }
     });
    }

  componentDidMount(){
    this.getTreeofDomain();
  }

    render (){
    return <div> Hello, Haters! </div>;
  }
}

SunburstView.propTypes = {
 
};