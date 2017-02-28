import React from 'react';
import Request from 'superagent';
import Snackbar from 'material-ui/Snackbar';

export default class FormStatement extends React.Component{
  constructor(props) {
    super(props);
    this.createResource = this.createResource.bind(this);
    this.formStatement = this.formStatement.bind(this);
    this.state = {
      ready: false,
      domain: null,
      subject: null,
      object: null,
      predicate: null,
      open: false,
      message: ''
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.ready){
      this.setState({
        domain: nextProps.domain,
        ready: true,
        subject: nextProps.subject,
        object: nextProps.object,
        predicate: nextProps.predicate,
      });
    }
  }

  createResource(){
    let url = `/domain/${this.state.domain}/resource`;
    let that = this;
    return new Promise(
      function(resolve, reject){
        Request.post(url).send(that.state.subject).end((err, res) => {
          if(err){
            reject(err);
          }else{
            resolve(res.body);
          }
        });
    });
  }

  formStatement(){
    let url = `/domain/${this.state.domain}/subject/${this.state.subject['subtype']}/${this.state.subject['subname']}/object`;
    console.log('URL' + url);
    let data = this.state.object;
    data['predicate'] = this.state.predicate;
    console.log(data);
    Request.post(url).send(data).end((err, res) => {
      if(err){
        this.setState({
          open: true,
          ready: false,
          message: 'Error Forming'
        });
      }else{
        this.setState({
          open: true,
          ready: false,
          message: 'Statment Formed'
        });
      }
    });
    this.setState({
      ready: false
    });
  }

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render(){
    if(this.state.ready){
      if(this.state.subject !== null){
        this.createResource().then(result => {
          if(result.name == this.state.subject['subname']){
            this.setState({
              open: true,
              ready: false,
              message: 'Resource Created'
            });
            if(this.state.object !== null && this.state.predicate !== null){
              this.formStatement();
            }
          }else{
            this.setState({
              open: true,
              message: 'Error Forming',
              ready: false
            });
          }
        },err => {
          this.setState({
            open: true,
            message: 'Error Forming',
            ready: false
          });
        }
      );
      }
    }
    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
          />
      </div>
    );
  }
}
