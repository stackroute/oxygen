import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import {Card, CardTitle,CardActions, CardMedia, CardText} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';
import {Link} from 'react-router';
import {grey300} from 'material-ui/styles/colors';
import ActionInfo from 'material-ui/svg-icons/action/info';
import {green300,blue300,lime800,lightGreen500,grey900} from 'material-ui/styles/colors';
const domaincard={
	fontSize: "20px",
	fontWeight: "bold",
	textAlign:"left"

};
const tooltipStyle={
	width:'100px',
	padding:'5px',
	fontSize:'10px'
}
const iconStyles={
	width:'28px',
	height:'28px',
	marginLeft:'10px',
	marginTop: '5px',
	Color:grey900
}
const roundImg={
	borderRadius: '50%',
	minWidth:'0%',
	width:'47%',
	marginTop:'35px',
	height:'145px'
}
const styles = {
	chip: {
		marginTop: '10px',
		marginLeft: '5px',
		padding:0,
		marginBottom:'7px',
		marginRight:'2px',
  },
	chip2: {
		marginTop: '10px',
		marginLeft: '5px',
		padding:0,
		marginBottom:'7px',
		marginRight:'2px',
		color:grey900,
    float:'left'
	},
	cardRound:{
		borderRadius: '2%',
		marginBottom: '50px'
	},
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  colorCode:{
    color:'gray',
		padding:0
  },
  padd:{
    paddingTop:'2px',
    paddingBottom:'8px'
  },
  paddHeader:{
    paddingTop:0,
    paddingBottom:'6px',
    marginRight:'7px',
    color:'gray'
  },
  paddIcon:{
    paddingTop:'5px',
		width:'48',
		height:'48',
		marginBottom:0
	}
};
const cusbut={
	paddingRight:0,
	color:'green'
};
export default class DomainShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {canSubmit:false,conceptColor:'',intentColor:'',docsColor:''}
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
				<Link to={'/graph'+this.props.item.name} style={{textDecoration:'none'}}>
  			<Card style={styles.cardRound}>
        <CardMedia style={{height:'280px',borderRadius: '2%',width :'100%',backgroundColor:this.state.conceptColor}} overlay={<CardTitle title={this.props.item.name} subtitle="Domain" style={styles.padd}/>}>
				<img src={this.props.item.domainImgURL} style={roundImg}/>
			  </CardMedia>
        <CardText style={styles.colorCode}>
        <Row>
			  <Col sm={1}>
					</Col>
			  <Col sm={2}>
       <IconButton iconStyle={iconStyles} tooltip={this.props.item.description} tooltipStyles={tooltipStyle}>
        <ActionInfo />
		  	</IconButton></Col>
			  <Col sm={8}>
		  	 <h2>Domain Information</h2>
		  	 </Col>
		    </Row>
        </CardText>

        <Row>
					<Col sm={1}>
					 </Col>
					<Col sm={6}>
					 <Chip backgroundColor={grey300} style={styles.chip}>Concepts Available:</Chip>
					 </Col>
					 <Col sm={1}>
						</Col>
					 <Col sm={3}>
					 <Chip backgroundColor={this.state.conceptColor} style={styles.chip2}>
					 {this.props.item.concepts.length}
					 </Chip>
					 </Col>
          </Row>

					<Row>
						<Col sm={1}>
						 </Col>
						<Col sm={6}>
						 <Chip backgroundColor={grey300} style={styles.chip}>Intents Available:</Chip>
						 </Col>
						 <Col sm={1}>
							</Col>
						 <Col sm={3}>
						 <Chip backgroundColor={this.state.intentColor} style={styles.chip2}>
						 {this.props.item.intents.length}
						 </Chip>
						 </Col>
						</Row>

						<Row>
							<Col sm={1}>
							 </Col>
							 <Col sm={6}>
								<Chip backgroundColor={grey300} style={styles.chip}>Documents Available:</Chip>
								</Col>
								<Col sm={1}>
								 </Col>
								<Col sm={3}>
								<Chip backgroundColor={this.state.docsColor} style={styles.chip2}>
								{this.props.item.docs}
								</Chip>
								</Col>
							</Row>

			</Card>
			</Link>
			</Row>
			</div>
			);
	}
}
