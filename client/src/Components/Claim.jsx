import React, { useState, useEffect } from 'react';
import * as api from "../services/api";

function Claim(props) {
  const { postId } = props;
  const [promise, setPromise] = useState(null);
  const { getClaim, fulfilClaim } = api;
  useEffect(() => {
    console.log(postId);
    getClaim(postId).then((res) => {
      if (res) {
        setPromise(res.promise);
      }
    });
  }, []);

  const handleClick = () => {
    fulfilClaim({ postId }).then((res) => {
      console.log(res);
    });
  };

  
  return (
    <div className="create-container">
    enter pizza info and card info on this page
      <br />
    from here you can promise a promise made for a post on the reddit
      <button type="button" onClick={handleClick}> Claim this promise!!</button>
    </div>


  );
}

export default Claim;
