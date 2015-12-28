var React=require('react');
var ReactDom=require('react-dom');
var $=require('jquery');
var CommentList=require('./CommentList.jsx');
var CommentForm=require('./CommentForm.jsx');

var CommentBox=React.createClass({
	loadCommentsFromServer:function(){
		$.ajax({
			url:this.props.url,
			dataType:'json',
			success:function(data){
				this.setState({data:data});
			}.bind(this),
			error:function(xhr,status,err){
				console.log(this.props.url,status,err.toString());
			}.bind(this)
		})
	},
	getInitialState:function(){  //只执行一次,设置初始化状态
		return {data:[]};
	},
	componentDidMount:function(){
		this.loadCommentsFromServer();
		//setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},
	handleCommentSubmit:function(comment){
		var comments=this.state.data;
		comment.id=Date.now();
		var newComments=comments.concat([comment]);
		this.setState({data:newComments});
		$.ajax({
			url:this.props.url,
			dataType:"json",
			type:'post',
			data:comment,
			success:function(data){
				this.setState({data:data});
			}.bind(this),
			error:function(xhr,status,err){
				console.log(this.props.url,status,err.toString());
			}.bind(this)
		})
	},
	render:function(){
		return (
				<div className="commentBox">
					<h1>Comments</h1>
					<CommentList data={this.state.data}/>
					<CommentForm onCommentSubmit={this.handleCommentSubmit}/>
				</div>
			)
	}
})

ReactDom.render(<CommentBox url="/api/comments.json" pollInterval={2000}/>,document.getElementById('app'));

