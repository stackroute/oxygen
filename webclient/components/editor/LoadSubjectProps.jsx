import React from 'react';
import TextField from 'material-ui/TextField';
import { FormsyCheckbox, FormsyDate, FormsyRadio, FormsyRadioGroup,
FormsySelect, FormsyText, FormsyTime, FormsyToggle, FormsyAutoComplete } from 'formsy-material-ui/lib';
import IconButton from 'material-ui/IconButton';
import AddButton from 'material-ui/svg-icons/content/add';
import RemoveButton from 'material-ui/svg-icons/content/remove';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import DeleteNode from './DeleteNode';
import Formsy from 'formsy-react';

export default class LoadSubjectProps extends React.Component{
  constructor(props){
    super(props);
    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
    this.resetSubjectProps = this.resetSubjectProps.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.saveSubject = this.saveSubject.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.state = {
      propertyCount: 0,
      keyValue: [],
      subname: '',
      subtype: '',
      attributes: {},
      formData: {},
      open: false,
      nodeDetails: {},
      edited: false
    };
  }

  resetSubjectProps(){
    let self = this;
    return new Promise(
      function(resolve, reject){
        self.setState({
          subname: '',
          subtype: '',
          attributes: {},
          keyValue: [],
          propertyCount: 0,
          deleteCount: 0
        }, function(){
            if(self.state.keyValue.length == 0){
              resolve(Object.keys(self.state.attributes).length);
            }else{
              reject(false);
            }
        });
      });
  }

componentWillReceiveProps(nextProps){
    if(nextProps.subjectDetails !== null){
      this.resetSubjectProps().then(result => {
        let that = this;
        Object.keys(nextProps.subjectDetails['attributes']).forEach(function(key,index){
          that.state.keyValue.push(that.tempFunc(key,nextProps.subjectDetails['attributes'][key],index));
          that.setState(that.state);
        });
        let propertyCount = this.state.propertyCount;
        this.setState({
          subname: nextProps.subjectDetails['subname'],
          subtype: nextProps.subjectDetails['subtype'],
          propertyCount: propertyCount + Object.keys(nextProps.subjectDetails['attributes']).length,
        });
      }, err => {
        console.log('here at promise fail');
      }
    );
  }else{
    this.resetSubjectProps().then(result => {
      console.log('Done');
    });
  }

}

  removeProperty(key){
    this.state.keyValue[key] = null;
    this.setState(this.state);
    this.setState({
      edited: true
    });
  }

  tempFunc(key,value,index){
    return (
      <div>
        <FormsyText
        name= {'k' + index}
        defaultValue = {key}
        required
        onChange={this.selectNode}
        floatingLabelText="property name"
        style={{
            width: '40%'
        }}
      />
      <FormsyText
        name={'v' + index}
        defaultValue = {value}
        required
        onChange={this.selectNode}
        floatingLabelText="property value"
        style={{
            width: '40%'
        }}
      />{key !== 'name' &&
        <IconButton onTouchTap = {this.removeProperty.bind(this,index)} style={{
            width: '20%'
          }}>
          <RemoveButton/>
        </IconButton>
      }
     </div>
  );
  }

  submitForm(data) {
    let formData = {
      attributes: {

      }
    };
    Object.keys(data).forEach(function(key,index){
      if(index < 1){

      }else{
        let k = key.substr(1,key.length);
        let v = data['v'+k];
        if(Object.keys(formData['attributes']).indexOf(data[key]) == -1 && key.substr(0,1) == 'k'){
          formData['attributes'][data[key]] = v;
        }
      }
    });
    formData['subtype'] = this.state.subtype;
    formData['subname'] = data['subname'];
    formData['attributes']['name'] = data['subname'];
    if(this.state.subtype.length == 0){
      formData['subtype'] = data['subtype'];
    }
    this.saveSubject(formData);
  }

  saveSubject(formData){
    this.props.updateSubjectCard(formData);
  }

  addProperty(){
    let propertyCount = this.state.propertyCount;
    this.state.keyValue.push(this.tempFunc('','',propertyCount));
    this.setState(this.state);
    this.setState({
      propertyCount: propertyCount + 1,
      edited: true
    });
  }

  handleDelete(){
    let nodeDetails = {};
    nodeDetails['domainName'] = this.props.selectedDomain;
    nodeDetails['nodetype'] = this.state.subtype;
    nodeDetails['nodename'] = this.state.subname;
    this.setState({
      nodeDetails : nodeDetails,
      open: true
    });
  }

  handleModal(){
    this.setState({
      open: false
    });
  }

  selectNode(node){
    this.setState({
      edited: true
    });
  }

  render(){
    return (
      <div>
        <Formsy.Form
          onValid={this.enableButton}
          onValidSubmit={this.submitForm}
        >{this.state.subtype.length == 0 &&
          <FormsySelect
            name="subtype"
            required
            floatingLabelText="Select Type"
            onChange={this.selectNode}
            menuItems={this.selectFieldItems}
            style={{
                width: '100%'
            }}
          >
            <MenuItem value={'Intent'} primaryText="Intent" />
            <MenuItem value={'Concept'} primaryText="Concept" />
          </FormsySelect>
        }
        <FormsyText
          name="subname"
          defaultValue={this.state.subname}
          required
          onChange={this.selectNode}
          hintText="A Subject Name"
          floatingLabelText="Subject Name"
          style={{
              width: '100%'
          }}
        />
      {this.state.keyValue}
      <FlatButton label='Add Property'
         primary={true}
         onTouchTap = {this.addProperty}
         style = {{
           marginTop: '20px'
         }}
         />
       <Divider/>
       {this.state.edited &&
           <FlatButton primary={true} type="submit" label="Apply"
             style={{
               float: 'right'
             }}/>
         }
         {this.state.propertyCount > 0 &&
           <FlatButton label='Delete' onTouchTap={this.handleDelete} style={{
               float: 'right'
             }}/>
         }
      </Formsy.Form>
      <DeleteNode open = {this.state.open} nodeDetails={this.state.nodeDetails} handleModal = {this.handleModal}/>
      </div>
    )
  }
}
