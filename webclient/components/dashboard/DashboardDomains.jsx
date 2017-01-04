import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreHorzIcon from 'material-ui/svg-icons/navigation/more-horiz';
import {Card, CardTitle, CardMedia} from 'material-ui/Card';
import {Container, Row, Col, Visible} from 'react-grid-system';
import {Link} from 'react-router';
import ActionInfo from 'material-ui/svg-icons/action/info';
import ActionAddBox from 'material-ui/svg-icons/content/add-box';
import {blue300, lime800, lightGreen500} from 'material-ui/styles/colors';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

const docFont = {
	fontSize: '15px',
	marginRight: '20px',
	width: '90%'
};
// const info = {
// 	paddingLeft: 0,
// 	paddingTop: 3
// };
// const iconStyles = {
// 	width: '28px',
// 	height: '28px',
// 	marginTop: 5,
// 	marginLeft: 3
// };
// const iconStyles1 = {
// 	width: '28px',
// 	height: '28px',
// 	marginTop: '5px',
// 	paddingLeft: 0,
// 	float: 'left'
// };
const roundImg = {
	borderRadius: '50%',
	minWidth: '0%',
	width: '47%',
	marginTop: '32px',
	height: '147px'
};
const styles = {
	cardLabel: {
		color: 'white',
		fontWeight: 600
	},
	chip: {
		marginTop: '10px',
		marginLeft: '5px',
		padding: 0,
		marginBottom: '7px',
		marginRight: '2px'
	},
	cardRound: {
		borderRadius: '2%',
		marginBottom: '50px'
	},
	colorCode: {
		color: 'grey',
		padding: 0
	},
	padd: {
		paddingTop: '2px',
		paddingBottom: '8px'
	}
};
const xsChip = {
	cardLabel: {
		color: 'white',
		fontWeight: 600,
		fontSize: 20
	},
	chip: {
		marginTop: '10px',
		marginLeft: '5px',
		padding: 0,
		fontWeight: 600,
		fontSize: 20,
		marginBottom: '7px',
		marginRight: '2px'
	}
};

export default class DomainShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {canSubmit: false,
			conceptColor: '',
			intentColor: '',
			docsColor: '',
			open: false,		 
			openDialog: false,
			openDialogDocs: false ,
			value: 'select',
			docs: [],
			concept: ''};
		}

		handleChange(event,index) {
			this.setState({concept: index});
		}

		handleRefresh() {
			this.props.freshlyIndex(this.props.item.name);
		}
		handleOpen = () => {
			this.setState({openDialog: true});
		};

		handleClose = () => {
			this.setState({openDialog: false});
		};
		handleOpenDocs = () => {
			this.setState({openDialogDocs: true, url: 0,canSubmit: false});
		};

		handleCloseDocs = () => {
			this.setState({openDialogDocs: false});
		};
		handleTouchTap = () => {
			this.setState({
				open: true
			});
		};
		handleRequestClose = () => {
			this.setState({
				open: false
			});
		};
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
		changeDocList(e) {
			console.log(this.state.docs);
			let docs=e.target.value;
			let docArr=docs.split(',');
			this.setState({docs:docArr});
		}
		componentWillMount()
		{
			let concept=this.props.item.concepts[0];
			this.setState({concept: concept});
			if(this.props.item.docs === 0)
			{
				this.setState({docsColor: blue300});
			}
			else if(this.props.item.docs < 11)
			{
				this.setState({docsColor: lime800});
			}
			else {
				this.setState({docsColor: lightGreen500});
			}

			if(this.props.item.intents.length === 0)
			{
				this.setState({intentColor: blue300});
			}
			else if(this.props.item.intents.length < 11)
			{
				this.setState({intentColor: lime800});
			}
			else {
				this.setState({intentColor: lightGreen500});
			}


			if(this.props.item.concepts.length < 5)
			{
				this.setState({conceptColor: blue300});
			}
			else if(this.props.item.concepts < 15)
			{
				this.setState({conceptColor: lime800});
			}
			else {
				this.setState({conceptColor: lightGreen500});
			}
		}
		handleSubmit() {

			let docs=
			{
				"concepts":[ {
					"name":this.state.concept,
					"urls":this.state.docs
				}
				]
			}
			this.props.addDocument({domainName:this.props.item.name,docs:docs});
		}
		render()
		{
			const actions = [
			<FlatButton
			label="Cancel"
			secondary={true}
			onTouchTap={this.handleClose}
			/>,
			<FlatButton
			label="Confirm"
			primary={true}
			keyboardFocused={true}
			onClick={this.handleRefresh.bind(this)}
			onTouchTap={this.handleClose}
			/>
			];
			const actionsDocs = [
			<FlatButton
			label="Cancel"
			secondary={true}
			onTouchTap={this.handleCloseDocs}
			/>,
			<FlatButton
			label="Submit"
			primary={true}
			keyboardFocused={true}
			onTouchTap={this.handleCloseDocs}
			disabled={!this.state.canSubmit}
			onClick={this.handleSubmit.bind(this)}
			/>
			];
		//let UrlError= 'please enter a URL';
		const items = [];

		for (let i = 0; i < this.props.item.concepts.length; i+=1) {
			items.push(<MenuItem 
				value={this.props.item.concepts[i]} 
				key={i} primaryText={this.props.item.concepts[i]} />);
		}
		return(
			<div>
			<Snackbar
			open={this.state.open}
			message={this.props.item.description}
			autoHideDuration={6000}
			onRequestClose={this.handleRequestClose}
			/>
			<Card style = {styles.cardRound}>
			<Link to = {'/graph/' + this.props.item.name} style = {{textDecoration: 'none'}}>
			<CardMedia style = {{height: '280px', borderRadius: '2%',
			width: '100%', backgroundColor: this.state.conceptColor,marginBottom:25}}
			overlay = {<CardTitle title = {this.props.item.name} subtitle = 'Domain'
			style = {styles.padd}/>}>
			<img src = {this.props.item.domainImgURL} style = {roundImg}/>
			</CardMedia>
			<Row style={{margin: 'auto 0px'}}>
			<Visible sm md lg xl>
			<Row style={{paddingLeft: 45}}>
			<Col sm={6}>
			<Chip backgroundColor = {'grey'} labelStyle = {styles.cardLabel}
			style = {styles.chip}>Concepts Available:</Chip>
			</Col>
			<Col sm={3} style={{paddingLeft: 58}}>
			<Chip backgroundColor = {this.state.conceptColor}
			labelStyle = {styles.cardLabel} style = {styles.chip}>
			{this.props.item.concepts.length}
			</Chip>
			</Col>
			</Row>
			<Row style = {{paddingLeft: 45}}>
			<Col sm={6}>
			<Chip backgroundColor = {'grey'}
			labelStyle = {styles.cardLabel}
			style = {styles.chip}>Intents Available : </Chip>
			</Col>
			<Col sm={3} style={{paddingLeft: 58}}>
			<Chip backgroundColor = {this.state.intentColor}
			labelStyle = {styles.cardLabel} style = {styles.chip}>
			{this.props.item.intents.length}
			</Chip>
			</Col>
			</Row>
			<Row style = {{paddingLeft: 45}}>
			<Col sm={6}>
			<Chip backgroundColor={'grey'}
			labelStyle={styles.cardLabel}
			style={styles.chip}>Documents Available:</Chip>
			</Col>
			<Col sm={3}style={{paddingLeft: 58}}>
			<Chip backgroundColor={this.state.docsColor}
			labelStyle = {styles.cardLabel}
			style = {styles.chip}>
			{this.props.item.docs}
			</Chip>
			</Col>
			</Row>
			</Visible>
			<Visible xs>
			<Container>
			<Row style = {{marginLeft: '-5px', padding: '0 15px'}}>
			<Col xs={4} style={{paddingLeft: 0}}>
			<Chip
			labelStyle={xsChip.cardLabel}
			style = {xsChip.chip}
			backgroundColor={this.state.conceptColor}
			>
			<Avatar size={32} color = 'white' backgroundColor='grey'>
			C
			</Avatar>
			{this.props.item.concepts.length}
			</Chip>
			</Col>
			<Col xs={4} style={{paddingLeft: 0}}>
			<Chip
			labelStyle={xsChip.cardLabel}
			style={xsChip.chip}
			backgroundColor={this.state.intentColor}
			>
			<Avatar size={32} color='white' backgroundColor='grey'>
			I
			</Avatar>
			{this.props.item.intents.length}
			</Chip>
			</Col>
			<Col xs={4} style={{paddingLeft: 0}}>
			<Chip
			labelStyle={xsChip.cardLabel}
			style={xsChip.chip}
			backgroundColor={this.state.docsColor}
			>
			<Avatar size={32} color='white' backgroundColor='grey'>
			D
			</Avatar>
			{this.props.item.docs}
			</Chip>
			</Col>
			</Row>
			</Container>
			</Visible>
			</Row>
			</Link>
			<Row>
			<Col lg={12} md={12} sm={12} xs={12} 
			style={{paddingLeft:0,marginLeft:0,marginTop:0,paddingTop:0}}>
			<IconMenu
			iconButtonElement={<IconButton 
				style={{paddingBottom:0}}>
				<MoreHorzIcon style={{color:'grey'}}/>
				</IconButton>}
				anchorOrigin={{horizontal: 'left', vertical: 'top'}}
				targetOrigin={{horizontal: 'left', vertical: 'top'}}
				style={{float:'right'}}
				>
				<MenuItem primaryText="Information" 
				leftIcon={<ActionInfo/>} 
				onTouchTap = {this.handleTouchTap}/>
				<MenuItem primaryText="Add Documents" 
				leftIcon={<ActionAddBox/>} 
				onTouchTap = {this.handleOpenDocs}/>
				<MenuItem primaryText="ReIndex" 
				leftIcon={<NavigationRefresh/>}	
				onTouchTap={this.handleOpen}/>
				</IconMenu>
				</Col>
				</Row>
				</Card>
				<Dialog
				title="Do you want to Re Index .. ?"
				titleStyle={{color:'grey'}}
				actions={actions}
				modal={false}
				open={this.state.openDialog}
				onRequestClose={this.handleClose}
				bodyStyle={{color:'grey'}}
				>
				Click confirm to start a fresh Indexing of documents .
				</Dialog>
				<Dialog
				title="Add documents for a concept"
				titleStyle={{color: "#858586",
				fontSize: 30,
				backgroundColor: "#c7c7c7"}}
				actions={actionsDocs}
				modal={false}
				open={this.state.openDialogDocs}
				onRequestClose={this.handleCloseDocs}
				autoScrollBodyContent={true}
				>

				<Formsy.Form
				ref="form"
				style={{"paddingBottom": '10px'}}
				onValid={this.enableButton.bind(this)}
				onInvalid={this.disableButton.bind(this)}
				onValidSubmit={this.handleSubmit.bind(this)}
				>
				<Col lg={6} md={6} sm={6} xs={6}>
				<h3 style={{paddingTop: 15,color: 'grey'}}>
				Select Concept</h3>
				</Col>
				<Col lg={6} md={6} sm={6} xs={6}>

				<FormsySelect
				name="frequency"
				required
				floatingLabelText="Selected Concept"

				value= {this.state.concept}
				onChange={this.handleChange.bind(this)}
				>
				{items}
				</FormsySelect>
				</Col>
				<Divider />
				<Row>
				<Col lg={12} md={12} sm={12} xs={12}>
				<h3 style={{paddingLeft: 15,color: 'grey'}}>Index Documents :</h3>
				</Col>
				</Row>

				<Row>
				<Col lg={12} md={12} sm={12} xs={12}>
				<FormsyText
				type= 'text'
				required
				multiLine={true}
				//validationError= {UrlError}
				updateImmediately
				hintText= 'add document..'
				name= 'add Doc'
				style={docFont}
				fullWidth={true}
				onChange={this.changeDocList.bind(this)}
				/></Col>
				</Row>
				</Formsy.Form>
				</Dialog>
				</div>
				);
}
}
DomainShow.propTypes = {
	item: React.PropTypes.object,
	freshlyIndex: React.PropTypes.func,
	addDocument: React.PropTypes.func
};
