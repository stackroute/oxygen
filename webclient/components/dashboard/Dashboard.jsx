import React from 'react';
import DomainShow from './DashboardDomains.jsx';
import Request from 'superagent';
import AddDomain from './AddDomain.jsx';
import Notification from './Notification.jsx';
import {Container, Col, Row, Visible} from 'react-grid-system';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import IconButton from 'material-ui/IconButton';
import {ScreenClassRender} from 'react-grid-system';

const errStyle = (screenClass) => {
	if (screenClass === 'xl') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	if (screenClass === 'lg') {return { width:700,margin: "20% auto 5%",textAlign:"left"};}
	if (screenClass === 'md') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	if (screenClass === 'sm') {return { width:700,margin: "20% auto 5%",textAlign:"left" };}
	return { width:300,margin: "20% auto 5%",textAlign:"left" };
};

// const imgStyle = (screenClass) => {
// 	if (screenClass === 'xl') {return { width: '700px',height:"auto" };}
// 	if (screenClass === 'lg') {return { width: '600px',height:"auto"};}
// 	if (screenClass === 'md') {return { width: '600px',height:"auto" };}
// 	if (screenClass === 'sm') {return { width: '600px',height:"auto" };}
// 	return { width: '300px',height:"auto"};
// };
// const divStyle = (screenClass) => {
// 	if (screenClass === 'xl') {return { width: '700px',margin:"5% auto auto" };}
// 	if (screenClass === 'lg') {return { width: '600px',margin:"5% auto auto"};}
// 	if (screenClass === 'md') {return { width: '600px',margin:"5% auto auto" };}
// 	if (screenClass === 'sm') {return { width: '600px',margin:"5% auto auto" };}
// 	return { width: '300px',margin:"6% auto auto"};
// };

const iconStyle={
	iconSize: {
		width: 30,
		height: 30,
		backgroundColor: '#a9a9a9',
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
		left:30,
		float:'left'
	},
	rightIcon:{
		position:"fixed",
		top:"45%",
		right:30,
		float:'right'
	},
	leftIconAvg:{
		position:"relative",
		margin:"20 0 0 30 ",
		padding:0,
		zDepth:10,
		float:'left'
	},
	rightIconAvg:{
		position:"relative",
		margin:"20 30 0 0",
		padding:0,
		zDepth:10,
		float:'right'
	}
}
const fonts={

	textAlign: "center",
	fontFamily: "sans-serif",
	color: "#1976d2 "

}
const style = {
	refresh: {
		marginTop: '200px',
		display: 'inline-block',
		position: 'relative'
	}
};

// const NoContent=()=>{
// 	return(
// 		<ScreenClassRender style={divStyle}>
// 		<div>
// 		<ScreenClassRender style={imgStyle}>
// 		<img src='./../assets/images/sry.png' />
// 		</ScreenClassRender>
// 		</div>
// 		</ScreenClassRender>
// 		);
// }  <NoContent />



export default class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			domainList: [], canSubmit: false, errmsg: '', loading: 'loading', pageNum: 1};
		}
		addDomain(domain)
		{
			// console.log('in adding module '+domain.name);
			// console.log('length before call '+this.state.domainList.length);
			let url = `/domain/` + domain.name;
			Request
			.post(url)
			.send(domain)
			.end((err, res) => {
				if(err) {
					// console.log(err)
				}
				// console.log('got response '+JSON.parse(res.text).name);
				// console.log('length after call '+this.state.domainList.length);
				let domainList1 = this.state.domainList;
				let response = JSON.parse(res.text);
				domainList1.push(response);
				// console.log('Response for posting new job : ', response);
				this.setState({domainList: domainList1});
			});
		}
		show()
		{
			let url = `/domain/`;
			Request
			.get(url)
			.end((err, res) => {
				if(err) {
				// res.send(err);
				this.setState({errmsg: res.body, loading: 'hide'});
			}

			else {
				// console.log('Response on show: ', JSON.parse(res.text));
				// let domainList1=this.state.domainList;
				let response = JSON.parse(res.text);
				if(response.length === 0)
				{
					this.setState({domainList: [], loading: 'hide'});
				}
				else {
					this.setState({domainList: response, loading: 'hide'});
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
			let page = this.state.pageNum;
			if(e.currentTarget.dataset.id === 'prev')
			{
				page -= 1;
				this.setState({pageNum: page});
			}
			else
			{
				page += 1;
				this.setState({pageNum: page});
			}
		}


		freshlyIndex(domain)
		{
			// console.log('inside Index refresh '+domain);
			let url = `/domain/` + domain + `/index`;
			Request
			.post(url)
			.send(domain)
			.end((err, res) => {
				if(err) {
					this.setState({errmsg: res.body});
				}
			});
		}

		addDocument(doc)
		{
			let url = `/domain/`+doc.domainName+`/crawl` ;
			Request
			.post(url)
			.send(doc.docs)
			.end((err, res) => {
				if(err) {
					this.setState({errmsg: res.body});
				}
				console.log(res);
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
					<NavigationArrowBack style={iconStyle.large} color={'white'} />
					</IconButton>
					</Col>
					<Col md={4} sm={4} xs={4} style={{float:"right"}}>
					<IconButton style={iconStyle.rightIconAvg} label="next" disabled={nextFlag} data-id="next"
					iconStyle={iconStyle.iconSize} onClick={this.onPageClick.bind(this)}>
					<NavigationArrowForward style={iconStyle.large} color={'white'} />
					</IconButton>
					</Col>

					</Row>)
			}

			let list=[];
			let dList=this.state.domainList;
			if(dList.length>0)
			{
				let pages = Math.ceil(dList.length/6);
				let pageNow = this.state.pageNum;
				if(pages === pageNow)
				{
					nextFlag = true;
				}
				if(this.state.pageNum === 1)
				{
					prevFlag = true;
				}
				if(pages === 1 || pages === pageNow)
				{
					list=[];
					for(let i=6*(pageNow-1);i < this.state.domainList.length; i+=1)
					{
						list.push(this.state.domainList[i]);
					}
				}
				else
				{
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
				{
					this.state.loading==="loading"?<RefreshIndicator
					size={70}
					left={10}
					top={0}
					status={this.state.loading}
					style={style.refresh}
					/>:<div>
					{
						list.length!==0?<div>
						<br/>
						<h1>OUR DOMAINS</h1>
						<Container>
						{
							list.map((item,i) =>{

								return (<Col lg={4} md={4} sm={6} xs={12} key={i}>
									<DomainShow freshlyIndex={this.freshlyIndex.bind(this)}
									index={i} key={i} indexs={i} ref="show" item={item}
									addDocument={this.addDocument.bind(this)}
									/>
									</Col>);
							})
						}
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
						
						</div>:
						<ScreenClassRender style={errStyle}>
						<div style={errStyle} >
						<h1 >It seems you have not yet created any domain
						<br/><a>Create a new domain</a></h1>
						</div>
						</ScreenClassRender>
					}
					</div>
				}
				<AddDomain
				addDomain={this.addDomain.bind(this)} style={{color: "#1976d2 "}}/>
				<Notification />
				</div>

				);
		}
	}
