import React, {Component} from "react";
import PostService from "./PostService";
import {flushSync} from "react-dom";

const postService = new PostService();

export default class Posts extends Component {
    constructor(props){
        super(props)
        this.state = {
            data : [],
            inputValue: ''
        };
        this.inputField = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
    	this.setState({inputValue: event.target.value});
	}

	handleSubmit(event) {
    	postService.createPost({'text' : this.state.inputValue}).then(() => {
            this.getData();
    	    this.setState({inputValue : ''});
        });
	}

    scrollToBottom() {
        this.inputField.current.scrollIntoView();
    }

    getData(){
    postService.getPosts().then(result => {
        flushSync(() => {
            this.setState({data: result.data});
        });
        this.inputField.current.focus();
        this.scrollToBottom();
    	});
    }

    componentDidMount(){
        this.getData();
    }

    setLike(post) {
        postService.setLikePost(post.id).then(() =>{
             post.likesCount += 1;
            this.forceUpdate();
        });
    }

    deletePost(post) {
    	postService.deletePost(post.id).then(() => this.getData());
	}

    render() {
        return (
            <div id = 'posts'>
            {this.state.data.map(post =>
                <div id = {'post_' + post.id} key={post.id}>
                    <p> {post.text} </p>
                    <button onClick={() => this.setLike(post)}>  {post.likesCount}</button>
                    <p> Date : {post.date}</p>
                    <button onClick={() => this.deletePost(post)}> Delete </button>
                    <hr/>
                </div>
            )}

                <input type='text' onChange={this.handleChange} value={this.state.inputValue}
                       onKeyDown={e => e.key === 'Enter' ? this.handleSubmit(e) : ''}
                       ref={this.inputField}></input>
                <button onClick={this.handleSubmit}>Send</button>
            </div>
            )
    }
}