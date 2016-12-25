import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import {Card, CardTitle,CardActions, CardMedia, CardText} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';
import {Link} from 'react-router';
import ActionInfo from 'material-ui/svg-icons/action/info';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import {green300,blue300,lime800,lightGreen500,grey900} from 'material-ui/styles/colors';
const tooltipStyle={
	//width:'100px',
	padding:'10px',
	zDepth:9999,
	fontSize:'15px'
}
const info=
{
	paddingLeft:25,
	paddingTop:3
}
const iconStyles={
	width:'28px',
	height:'28px',
	marginLeft:'10px',
	marginTop: '5px'
}
const iconStyles1={
	width:'28px',
	height:'28px',
	marginTop: '5px',
	paddingLeft:0,
	float:'left'
}
const roundImg={
	borderRadius: '50%',
	minWidth:'0%',
	width:'47%',
	marginTop:'35px',
	height:'145px'
}
const styles = {
	cardLabel:{
		color:"white",
		fontWeight:600
	},
	chip: {
		marginTop: '10px',
		marginLeft: '5px',
		padding:0,
		marginBottom:'7px',
		marginRight:'2px',
	},
	cardRound:{
		borderRadius: '2%',
		marginBottom: '50px'
	},
	colorCode:{
		color:'grey',
		padding:0
	},
	padd:{
		paddingTop:'2px',
		paddingBottom:'8px'
	}
};
const cusbut={
	paddingRight:0,
	color:'green'
};
export default class DomainShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {canSubmit:false,conceptColor:'',intentColor:'',docsColor:''};
	}

	handleRefresh() {
		console.log('inside handle refresh');
    this.props.freshlyIndex(this.props.item.name);
  }

	componentWillMount()
	{

		if(this.props.item.docs===0)
		{
			this.setState({docsColor:blue300});
		}
		else if(this.props.item.docs<11)
		{
			this.setState({docsColor:lime800});
		}
		else {
			this.setState({docsColor:lightGreen500});
		}

		if(this.props.item.intents.length==0)
		{
			this.setState({intentColor:blue300});
		}
		else if(this.props.item.intents.length<11)
		{
			this.setState({intentColor:lime800});
		}
		else {
			this.setState({intentColor:lightGreen500});
		}


		if(this.props.item.concepts.length<5)
		{
			this.setState({conceptColor:blue300});
		}
		else if(this.props.item.concepts<15)
		{
			this.setState({conceptColor:lime800});
		}
		else {
			this.setState({conceptColor:lightGreen500});
		}

	}
	render()
	{

		return(
			<div>
			<Row style={{marginBottom: '20px',marginLeft:'10px'}}>
			<Card style={styles.cardRound}>
			<Link to={'/graph/'+this.props.item.name} style={{textDecoration:'none'}}>
			<CardMedia style={{height:'280px',borderRadius: '2%',width :'100%',backgroundColor:this.state.conceptColor}} overlay={<CardTitle title={this.props.item.name} subtitle="Domain" style={styles.padd}/>}>
			<img src={this.props.item.domainImgURL} style={roundImg}/>
			</CardMedia>
			</Link>
			<CardText style={styles.colorCode}>
			<Row>
			<Col sm={1}>
			<IconButton iconStyle={iconStyles} tooltip={this.props.item.description} tooltipStyles={tooltipStyle} tooltipPosition="top-left" >
			<ActionInfo />
			</IconButton></Col>
			<Col sm={8}>
			<h2 style={info}>Domain Information</h2>
		  </Col>
			<Col sm={1} style={{padding:"auto 0px"}}>
				<IconButton iconStyle={iconStyles1} onClick={this.handleRefresh.bind(this)}>
				<NavigationRefresh/>
				</IconButton>
				</Col>
			</Row>
			</CardText>
			<Link to={'/graph/'+this.props.item.name} style={{textDecoration:'none'}}>
			<Row>
			<Col sm={1}>
			</Col>
			<Col sm={6}>
			<Chip backgroundColor={"grey"} labelStyle={styles.cardLabel} style={styles.chip}>Concepts Available:</Chip>
			</Col>
			<Col sm={1}>
			</Col>
			<Col sm={3}>
			<Chip backgroundColor={this.state.conceptColor} labelStyle={styles.cardLabel} style={styles.chip}>
			{this.props.item.concepts.length}
			</Chip>
			</Col>
			</Row>

			<Row>
			<Col sm={1}>
			</Col>
			<Col sm={6}>
			<Chip backgroundColor={"grey"} labelStyle={styles.cardLabel} style={styles.chip}>Intents Available:</Chip>
			</Col>
			<Col sm={1}>
			</Col>
			<Col sm={3}>
			<Chip backgroundColor={this.state.intentColor} labelStyle={styles.cardLabel} style={styles.chip}>
			{this.props.item.intents.length}
			</Chip>
			</Col>
			</Row>

			<Row>
			<Col sm={1}>
			</Col>
			<Col sm={6}>
			<Chip backgroundColor={"grey"} labelStyle={styles.cardLabel} style={styles.chip}>Documents Available:</Chip>
			</Col>
			<Col sm={1}>
			</Col>
			<Col sm={3}>
			<Chip backgroundColor={this.state.docsColor} labelStyle={styles.cardLabel} style={styles.chip}>
			{this.props.item.docs}
			</Chip>
			</Col>
			</Row>
      </Link>
			</Card>
			</Row>
			</div>
			);
	}
}
