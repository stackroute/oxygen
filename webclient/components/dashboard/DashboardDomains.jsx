import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import IconButton from 'material-ui/IconButton';
import {Card, CardTitle,CardActions, CardMedia, CardText} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';
import {Link} from 'react-router';
import {green300,blue300,grey300,lime800,green700} from 'material-ui/styles/colors';
import ActionBook from 'material-ui/svg-icons/action/book';
const domaincard={
	fontSize: "20px",
	fontWeight: "bold",
	textAlign:"left"

};
const styles = {
  chip: {
    marginLeft: '5px',
    padding:0,
    marginBottom:'7px',
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  colorCode:{
    color:'gray'
  },
  padd:{
    paddingTop:'8px',
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
		this.state = {canSubmit:false};
	}

	render()
	{
    {this.props.item.intents.map((ele,i) =>{
      if(ele.docs===0)
      {
        ele.color=blue300;
      }
      else if(ele.docs<11)
      {
        ele.color=lime800;
      }
      else {
        ele.color=green700;
      }
      })}
      if(this.props.item.concepts<5)
      {
        this.props.item.conceptColor=blue300;
      }
      else if(this.props.item.concepts<15)
      {
        this.props.item.conceptColor=lime800;
      }
      else {
        this.props.item.conceptColor=green700;
      }
		return(
			<div>
        <Row style={{marginBottom: '20px',marginLeft:'10px'}}>
  			<Card >
        <CardMedia style={{height:'280px',width :'355px',backgroundColor:this.props.item.conceptColor}} overlay={<CardTitle title={this.props.item.subject} subtitle="Domain" style={styles.padd}/>} />
        <CardText style={styles.colorCode}>
        {this.props.item.description}
        </CardText>
        <Row>
        <Col sm={1}><IconButton><ActionBook style={styles.paddIcon} /></IconButton></Col>
        <Col sm={7}><h4 style={styles.paddHeader}>Concepts Available:{this.props.item.concepts}</h4></Col>
        <Col sm={3}>
        <CardActions>
  			<Link to='/graph'>
  			<FlatButton label="SEARCH" primary={true} style={cusbut} />
        </Link>
  			</CardActions>
        </Col>
        </Row>

        <div>
          <Row>
          <Col sm={6}>
          <Chip backgroundColor={grey300} style={styles.chip}>
          <Avatar size={32} color={grey300} backgroundColor={this.props.item.intents[0].color}>I</Avatar>
          {this.props.item.intents[0].intent} {this.props.item.intents[0].docs}
          </Chip>
          </Col>
          <Col sm={6}>
          <Chip backgroundColor={grey300} style={styles.chip}>
          <Avatar size={32} color={grey300} backgroundColor={this.props.item.intents[1].color}>I</Avatar>
          {this.props.item.intents[1].intent} {this.props.item.intents[1].docs}
          </Chip>
          </Col>
          </Row>
          <Row>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.item.intents[2].color}>I</Avatar>
            {this.props.item.intents[2].intent} {this.props.item.intents[2].docs}
            </Chip>
            </Col>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.item.intents[3].color}>I</Avatar>
            {this.props.item.intents[3].intent} {this.props.item.intents[3].docs}
            </Chip>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
            <Chip backgroundColor={grey300} style={styles.chip}>
            <Avatar size={32} color={grey300} backgroundColor={this.props.item.intents[4].color}>I</Avatar>
            {this.props.item.intents[4].intent} {this.props.item.intents[4].docs}
            </Chip>
            </Col>
          </Row>
         </div>
  			</Card>
  			</Row>
			</div>
			);
	}
}
