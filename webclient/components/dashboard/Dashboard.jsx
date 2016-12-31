import React from 'react';
import DomainShow from './DashboardDomains.jsx';
import Request from 'superagent';
import AddDomain from './AddDomain.jsx';
import Notification from './Notification.jsx'
import {Container,Col,Row ,Visible} from 'react-grid-system';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import IconButton from 'material-ui/IconButton';
const iconStyle={
	iconSize: {

		width: 30,
		height: 30,
		backgroundColor: "#a9a9a9",
		padding: 10,
		borderRadius: 60
	},
	large: {
		width: 120,
		height: 120,
		padding: 30
	},
	leftIcon:{
		position:"fixed",
		top:"45%",
		left:"3%",
		float:'left'
	},
	rightIcon:{
		position:"fixed",
		top:"45%",
		right:"3%",
		float:'right'
	},
	leftIconAvg:{
		position:"relative",
		margin:"20 0 0 ",
		padding:0,
		zDepth:10,
		float:'left'
	},
	rightIconAvg:{
		position:"relative",
		margin:"20 0 0 ",
		padding:0,
		zDepth:10,
		float:'right'
	}
}
const fonts={
	margin: "0px auto",
	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2 "
}
const style = {
	refresh: {
		marginTop:'200px',
		display: 'inline-block',
		position: 'relative'
	}
};
export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			domainList: [],canSubmit:false,errmsg:'',loading:'loading',pageNum:1};
		}

		addDomain(domain)
		{
			console.log("in adding module "+domain.name);
			console.log('length before call '+this.state.domainList.length);
			let url =`/domain/`+domain.name;
			Request
			.post(url)
			.send(domain)
			.end((err, res) => {
				if(err) {
					console.log(err)
				}
				console.log("got response "+JSON.parse(res.text).name);
				console.log('length after call '+this.state.domainList.length);
				let domainList1=this.state.domainList;
				let response=JSON.parse(res.text);
				domainList1.push(response);
				console.log("Response for posting new job : ", response);
				this.setState({domainList:domainList1});
			});

		}

		show()
		{
			let url =`/domain/`;

			Request
			.get(url)
			.end((err, res) => {
				if(err) {
				//res.send(err);
				this.setState({errmsg: res.body,loading:"hide"});
			}

			else {
				console.log("Response on show: ", JSON.parse(res.text));
				//let domainList1=this.state.domainList;
				let response=JSON.parse(res.text);
				if(response.length===0)
				{
					this.setState({domainList:[],loading:'hide'});
				}
				else {
					this.setState({domainList:response,loading:'hide'});
				}
			}
		});
		}

		componentDidMount()
		{
			this.show();
		}

		onPageClick(e)
		{
			let page=this.state.pageNum;
			if(e.currentTarget.dataset.id==="prev")
			{
				page-=1;
				this.setState({pageNum:page});
			}
			else
			{
				page+=1;
				this.setState({pageNum:page});
			}
		}


		freshlyIndex(domain)
		{
			console.log('inside Index refresh '+domain);
			let url =`/domain/`+domain+`/index`;

			Request
			.post(url)
			.send(domain)
			.end((err, res) => {
				if(err) {
					this.setState({errmsg: res.body});
				}
			});
		}


		render() {
			let prevFlag=false;
			let nextFlag=false;
			const smallNav=()=>{
				return(<Row md={12} sm={12} xs={12} style={{marginBotton:20}}>
					<Col md={4} sm={4} xs={4} style={{float:"left"}}>
					<IconButton style={iconStyle.leftIconAvg} label="prev" disabled={prevFlag} data-id="prev"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowBack style={iconStyle.large} color={"white"} />
					</IconButton>
					</Col>
					<Col md={4} sm={4} xs={4} style={{float:"right"}}>
					<IconButton style={iconStyle.rightIconAvg} label="next" disabled={nextFlag} data-id="next"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowForward style={iconStyle.large} color={"white"} />
					</IconButton>
					</Col>
					</Row>)
			}
			let list=[];

			let dList=this.state.domainList;
			if(dList.length>0)
			{
				let pages=Math.ceil(dList.length/6);
				let pageNow=this.state.pageNum;
				if(pages===pageNow)
				{
					nextFlag=true;
				}
				if(this.state.pageNum===1)
				{
					prevFlag=true;
				}
				if(pages===1 || pages===pageNow)
				{
					list=[];
					for(let i=6*(pageNow-1);i<this.state.domainList.length;i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
				else {
					list=[];
					let foo=6*(pageNow-1);
					for(let i=foo;i<(foo+6);i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
			}
			return (
				<div style={fonts}>
				<h1 >Our Domains</h1>
				<Visible md sm xs>
				{smallNav}
				</Visible>
				{this.state.loading==="loading"?<RefreshIndicator
				size={70}
				left={10}
				top={0}
				status={this.state.loading}
				style={style.refresh}
				/>:<div>
				{list.length!==0?<div>

					<Container>
					{list.map((item,i) =>{
						return (<Col lg={4} md={6} sm={6} xs={12} key={i}>
							<DomainShow freshlyIndex={this.freshlyIndex.bind(this)}
							index={i} key={i} indexs={i} ref="show" item={item}/>
							</Col>);
					})}
					</Container>
					<Visible xl lg>
					<IconButton style={iconStyle.leftIcon} label="prev" disabled={prevFlag} data-id="prev"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowBack style={iconStyle.large} color={"white"} />
					</IconButton>
					<IconButton style={iconStyle.rightIcon} label="next" disabled={nextFlag} data-id="next"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowForward style={iconStyle.large} color={"white"} />
					</IconButton>
					</Visible>
					<Visible md sm xs>
					{smallNav}
					</Visible>
					</div>:<h1>NO DOMAINS AVAILABLE</h1>}</div>}
					<AddDomain
					addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
					<Notification />
					</div>

					);
		}
	}
