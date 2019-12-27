import React from 'react';
import queryString from 'query-string'

function Login() {
  const query = queryString.parse(window.location.search);
  const state = query.state || "";
  const url = state !== "" ? `http://localhost:3001/auth/reddit?state=${state}` : "http://localhost:3001/auth/reddit";

  return (
    <div className="login">
        <a href={url}> Login</a>
    </div>
  );
}

export default Login;
