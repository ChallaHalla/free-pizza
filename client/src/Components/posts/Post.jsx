import React from 'react';
import { Link } from "react-router-dom";

function Post(props) {
  const { post } = props;
  const handleResponse = () => {
    console.log(post.id);
  };

  const generateButton = () => {
    if(post.fulfilledBy){
      return(
        <button className="button" disabled> Request fulfilled by {post.fulfilledBy}! </button>
      )
     }
    if(post.requestCreated){
      return(<Link to={`/fulfil/${post.id}`} className="button is-primary" onClick={handleResponse}> Respond to request</Link> )
    } else{
      return(<Link to={`/fulfil/${post.id}`} type="button" className="button is-primary is-light" onClick={handleResponse}> Send join link</Link>)
    }
  }
  return (
    <div className="media post-container"> 
    <div className="media-content" >

    <h2> {post.title} </h2>
    <span className="description"> {post.description} </span>
    </div>
    <div className="media-right">
    {generateButton()}
    </div>
    </div>
  );
}

export default Post;
