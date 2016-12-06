import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';
import EditJobDialog from './EditJobDialog.jsx';
import {Link} from 'react-router';
const jobcard={
	fontSize: "20px",
	fontWeight: "bold",
	textAlign:"left"

}
const cusbut={
	paddingRight:0
}
export default class Show extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editing:false,canSubmit:false};
		this.renderNormal = this.renderNormal.bind(this);
		this.renderForm = this.renderForm.bind(this);
		this.saveFunction = this.saveFunction.bind(this);
		this.cancelFunction = this.cancelFunction.bind(this);
		this.enableButton = this.enableButton.bind(this);
		this.disableButton = this.disableButton.bind(this);
		this.editFunction = this.editFunction.bind(this);
		this.deleteFunction = this.deleteFunction.bind(this);

	}
	editFunction()
	{
		this.setState({editing:true});
		this.setState({query:this.props.item.query})
		this.setState({engineID:this.props.item.engineID})
		this.setState({extraTerms:this.props.item.extraTerms})
		this.setState({results:this.props.item.results})
		this.setState({siteSearch:this.props.item.siteSearch})
		this.props.update(this.props.item._id,);
	}
	enableButton() {
		this.setState(()=>({
			canSubmit: true
		}));
	}
	disableButton() {
		this.setState(()=>({
			canSubmit: false
		}));
	}
	saveFunction(newJob)
	{
		console.log("updatingggggg")
		this.props.update(this.props.item._id,newJob);
		this.setState({editing:false});
	}
	deleteFunction()
	{
		console.log("deletinggggggg "+this.props.item._id)
		this.props.deletejob(this.props.item._id);
	}
	componentWillMount()
	{
		console.log("is Mounting : "+this.state.editing);
	}
	cancelFunction()
	{
		this.setState({editing:false})
	}
	renderForm()
	{
		console.log('on editing jobs');
		return (
			<EditJobDialog item={this.props.item}
			save={this.saveFunction.bind(this)}
			cancel={this.cancelFunction.bind(this)}/>
			);

	}
	renderNormal() {
		console.log('on viewing jobs');
		return (
			<Row style={{marginBottom: "20px"}}>
			<Col lg={12}>
			<Card >
			<CardHeader style={jobcard} titleStyle={{"fontSize":"16pt"}}
			subtitleStyle={{"fontSize":"14pt"}}
			title={"Search Content"}
			subtitle={this.props.item.query}
			actAsExpander={true}
			showExpandableButton={true}
			/>
			<CardActions>
			<FlatButton label="EDIT" 
			onClick={this.editFunction} primary={true} style={cusbut} />
			<FlatButton label="DELETE" 
			onClick={this.deleteFunction} secondary={true} style={cusbut} />
			<Link to={'/jobResult/'+this.props.item._id}>
			<FlatButton label="SEARCH" primary={true} style={cusbut} />
			</Link>
			</CardActions>
			<CardText expandable={true} >
			<div >
			<Row >
			<Col lg={6}>
			<h4>{"ENGINE-ID : "+this.props.item.engineID}</h4>
			</Col>
			<Col lg={6}>
			<h4>{"SITE TO SEARCH : "+this.props.item.siteSearch}</h4>
			</Col>
			</Row>
			<Row >
			<Col lg={6}>
			<h4>{"TERMS TO INCLUDE : "+this.props.item.extraTerms}</h4>
			</Col>
			<Col lg={6}>
			<h4>{"RESULTS TO SHOW : "+this.props.item.results}</h4>
			</Col>
			</Row>
			</div>
			</CardText>
			</Card>
			</Col>
			</Row>
			);
	}
	render()
	{
		return(
			<div>
			{this.state.editing?this.renderForm():this.renderNormal()}
			</div>
			);
	}
}
