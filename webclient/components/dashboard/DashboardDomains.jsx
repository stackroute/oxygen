import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import {Card, CardTitle,CardActions, CardMedia, CardText} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';
import {Link} from 'react-router';
import {grey300} from 'material-ui/styles/colors';
import ActionBook from 'material-ui/svg-icons/action/book';
const domaincard={
	fontSize: "20px",
	fontWeight: "bold",
	textAlign:"left"

};
const roundImg={
	borderRadius: '50%',
	minWidth:'0%',
	width:'47%',
	marginTop:'35px',
	height:'145px'
}
const styles = {
  chip: {
    marginLeft: '5px',
    padding:0,
    marginBottom:'7px',
		marginRight:'2px',
  },
	cardRound:{
		borderRadius: '2%',
	},
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  colorCode:{
    color:'gray'
  },
  padd:{
    paddingTop:'2px',
    paddingBottom:'8px'
  },
  paddHeader:{
    paddingTop:0,
    paddingBottom:'6px',
    marginRight:'7px',
    color:'gray',
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
		this.state = {canSubmit:false}
}
	render()
	{

		return(
			<div>
        <Row style={{marginBottom: '20px',marginLeft:'10px'}}>
				<Link to='/graph' style={{textDecoration:'none'}}>
  			<Card style={styles.cardRound}>
        <CardMedia style={{height:'280px',borderRadius: '2%',width :'100%',backgroundColor:this.props.conceptColor}} overlay={<CardTitle title={this.props.item.subject} subtitle="Domain" style={styles.padd}/>}>
				<img src={this.props.item.image} style={roundImg}/>
			  </CardMedia>
        <CardText style={styles.colorCode}>
        {this.props.item.description}
        </CardText>
        <Row>
        <Col sm={3}><IconButton><ActionBook style={styles.paddIcon} /></IconButton></Col>
        <Col sm={9}><h3 style={styles.paddHeader}>Concepts Available:{this.props.item.concepts}</h3></Col>
        </Row>

        <div>
          <Row>
          <Col sm={6}>
          <Chip backgroundColor={grey300} style={styles.chip}>
          <Avatar size={32} color={grey300} backgroundColor={this.props.intentColor[0]}>I</Avatar>
          {this.props.item.intents[0].intent} {this.props.item.intents[0].docs}
          </Chip>
          </Col>
          <Col sm={6}>
          <Chip backgroundColor={grey300} style={styles.chip}>
          <Avatar size={32} color={grey300} backgroundColor={this.props.intentColor[1]}>I</Avatar>
          {this.props.item.intents[1].intent} {this.props.item.intents[1].docs}
          </Chip>
          </Col>
          </Row>
          <Row>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.intentColor[2]}>I</Avatar>
            {this.props.item.intents[2].intent} {this.props.item.intents[2].docs}
            </Chip>
            </Col>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.intentColor[3]}>I</Avatar>
            {this.props.item.intents[3].intent} {this.props.item.intents[3].docs}
            </Chip>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.intentColor[4]}>I</Avatar>
            {this.props.item.intents[4].intent} {this.props.item.intents[4].docs}
            </Chip>
            </Col>
          </Row>
         </div>
  			</Card>
				</Link>
  			</Row>
			</div>
			);
	}
}
