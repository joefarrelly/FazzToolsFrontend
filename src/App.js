import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Link, Redirect, useLocation } from 'react-router-dom';
import axios from 'axios';

const alts = [
  {
    altId: 23155,
    name: 'Fazze',
    realm: 'Doomhammer',
    class: 'Druid',
  }, {
    altId: 64252,
    name: 'Fazzlink',
    realm: 'Turalyon',
    class: 'Shaman',
  }, {
    altId: 95871,
    name: 'Fazzorc',
    realm: 'Draenor',
    class: 'Hunter',
  },
];

class AltTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {name: 'Hubert'};
  }

  render() {
    return (
      <div>
        <table className="AltTable">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Realm</th>
              <th>Class</th>
            </tr>
            { this.props.alt.map(NewAlt) }
          </tbody>
        </table>
        { this.state.name }
      </div>
    );
  }
}

function NewAlt(props) {
  return (
      <tr key={ props.altId }>
        <td>{ props.name}</td>
        <td>{ props.realm}</td>
        <td>{ props.class}</td>
      </tr>
    );
}

function MenuBar(props) {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/auth">Login</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/auth">
            <Auth />
          </Route>
          <Route path="/redirect">
            <AuthRedirect />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home () {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Auth () {
  window.location.replace('https://eu.battle.net/oauth/authorize?client_id=39658b8731b945fcba53f216556351b6&scope=wow.profile&state=blizzardeumz76c&redirect_uri=http://localhost:3000/redirect/&response_type=code');
  return (
    null
  );
}

function AuthRedirect () {
  let query = new URLSearchParams(useLocation().search);
  console.log(query.get('code'));
  console.log(query.get('state'));
  axios.post('http://127.0.0.1:8000/api/bnetlogin/', { state: query.get('state'), code: query.get('code'), client_id: '39658b8731b945fcba53f216556351b6'})
    .then(res => {
      console.log(res.data);
    })
    .catch(error => {
      console.log(error);
    })
  return (
    <Redirect to ="/" />
  );
}

function App() {
  return (
    <div>
      <AltTable alt={alts} />
      <MenuBar />
    </div>
    );
}


export default App;

    