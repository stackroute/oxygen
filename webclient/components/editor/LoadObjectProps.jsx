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

export default class LoadObjectProps extends React.Component{
  constructor(props){
    super(props);
    this.addProperty = this.addProperty.bind(this);
    this.removeProperty = this.removeProperty.bind(this);
    this.resetObjectProps = this.resetObjectProps.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.saveObject = this.saveObject.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.selectNode = this.selectNode.bind(this);
    this.state = {
      propertyCount: 0,
      keyValue: [],
      objname: '',
      objtype: '',
      attributes: {},
      nodeDetails: {},
      probableObjects: [<MenuItem value={'Concept'} primaryText="Concept" />, <MenuItem value={'Term'} primaryText="Term" />],
      edited: false
    };
  }

  resetObjectProps(){
    let self = this;
    return new Promise(
      function(resolve, reject){
        self.setState({
          objname: '',
          objtype: '',
          attributes: {},
          keyValue: [],
          propertyCount: 0
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
    if(nextProps.objectDetails !== null){
      this.resetObjectProps().then(result => {
        let that = this;
        Object.keys(nextProps.objectDetails['attributes']).forEach(function(key,index){
          that.state.keyValue.push(that.tempFunc(key,nextProps.objectDetails['attributes'][key],index));
          that.setState(that.state);
        });
        let propertyCount = this.state.propertyCount;
        this.setState({
          objname: nextProps.objectDetails['objname'],
          objtype: nextProps.objectDetails['objtype'],
          propertyCount: propertyCount + Object.keys(nextProps.objectDetails['attributes']).length,
        });
      }, err => {
        console.log('here at promise fail');
      }
    );

  }else{
    this.resetObjectProps().then(result => {
      console.log('Done');
    });

    if(nextProps.selectedSubject !== null && nextProps.selectedSubject['subtype'] == 'Intent'){
      this.setState({
        probableObjects: <MenuItem value={'Term'} primaryText='Term' />
      });
    }
    if(nextProps.selectedSubject !== null && nextProps.selectedSubject['subtype'] == 'Concept'){
      this.setState({
        probableObjects: <MenuItem value={'Concept'} primaryText='Concept' />
      });
    }
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
        formData[key] = data[key];
      }else{
        let k = key.substr(1,key.length);
        let v = data['v'+k];
        if(Object.keys(formData['attributes']).indexOf(data[key]) == -1 && key.substr(0,1) == 'k'){
          formData['attributes'][data[key]] = v;
        }
      }
    });
    formData['objtype'] = this.state.objtype;
    formData['objname'] = data['objname'];
    formData['attributes']['name'] = data['objname'];
    if(this.state.objtype.length == 0){
      formData['objtype'] = data['objtype'];
    }
    this.saveObject(formData);
  }

  saveObject(formData){
    this.props.updateObjectCard(formData);
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
    nodeDetails['nodetype'] = this.state.objtype;
    nodeDetails['nodename'] = this.state.objname;
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
        >{this.state.objtype.length == 0 &&
          <FormsySelect
            name="objtype"
            required
            floatingLabelText="Select Type"
            onChange={this.selectNode}
            menuItems={this.selectFieldItems}
            style={{
                width: '100%'
            }}
          >
            {this.state.probableObjects}
          </FormsySelect>
        }
        <FormsyText
          name="objname"
          defaultValue={this.state.objname}
          required
          onChange={this.selectNode}
          floatingLabelText="Object Name"
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
         <FlatButton label='Delete' onTouchTap={this.handleDelete} style={{
             float: 'right'
         }}/>
      </Formsy.Form>
      <DeleteNode open = {this.state.open} nodeDetails={this.state.nodeDetails} handleModal = {this.handleModal}/>
      </div>
    )
  }
}
