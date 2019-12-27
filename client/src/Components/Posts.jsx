import React, { useEffect, useState } from 'react';
import Post from "./posts/Post";
import * as api from "../services/api";
import "../styles/posts.scss"

function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    api.getPosts().then((res) => {
      console.log(res);
      setPosts(res);
    });
  }, []);
  if(posts.length === 0){
    return(
    <div className="posts-feed-container"> 
      <div className="media loader is-loading" />
      </div>
    )
  }
  return (
    <div className="posts-feed-container"> 
        Posts
      {posts.map((p) => <Post post={p} />)}
    </div>
  );
}

export default Posts;
