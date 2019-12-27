import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import Login from './Components/Login';
import Posts from './Components/Posts';
import Create from './Components/Create';
import Fulfil from './Components/Fulfil';
import Claim from './Components/Claim';

import './App.css';

function App() {
  return (
    <Router>
      <div className="sidebar">
    sidebar
      </div>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route
          path="/fulfil/:requestId"
          render={({ match }) => (<Fulfil requestId={match.params.requestId} />)}
        />
        <Route
          path="/claim/:postId"
          render={({ match }) => (<Claim postId={match.params.postId} />)}
        />
 
        <Route path="/posts">
          <Posts />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
