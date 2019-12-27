import React, { useState, useEffect } from 'react';
import * as api from "../services/api";

function Fulfil(props) {
  const { requestId } = props;
  const [request, setRequest] = useState(null);
  const { getRequest, fulfilRequest, sendJoinLink } = api;
  useEffect(() => {
    console.log(requestId);
    getRequest(requestId).then((res) => {
    console.log(res);
      if (res) {
        setRequest(res);
      }
    });
  }, []);

  const handleClick = () => {
    if (request) {
      fulfilRequest({ requestId }).then((res) => {
        console.log(res);
      });
    } else {
      sendJoinLink({ requestId }).then((res) => {
        console.log(res);
      });
    }
  };

  
  return (
    <div className="create-container">
    enter pizza info and card info on this page
      <br />
    From here you would go to a page where you insert card info and then make a resuest thru dominoes
      <button type="button" onClick={handleClick}>  Fulfil Pizza request!</button>
    </div>


  );
}

export default Fulfil;
