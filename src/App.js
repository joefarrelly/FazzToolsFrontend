import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

class AltTable extends React.Component {
  render() {
    const rows = [];
    
    this.props.alts.forEach((alt) => {
      rows.push(
        <AltTableRow alt={alt} key={alt.altId}/>
      );
    })
    return (
      <div>
        <table className="AltTable">
          <tbody>
            <tr>
              <th>ID</th>
              <th>Faction</th>
              <th>Level</th>
              <th>Name</th>
              <th>Realm</th>
              <th>Class</th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

class AltTableRow extends React.Component {
  render() {
    const alt = this.props.alt;
    return (
      <tr>
        <td>{alt.altId}</td>
        <td>{alt.altFaction}</td>
        <td>{alt.altLevel}</td>
        <td>{alt.altName}</td>
        <td>{alt.altRealm}</td>
        <td>{alt.altClass}</td>
      </tr>
    );
  }
}

class MenuBar extends React.Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/auth">Login</Link>
      </div>
    );
  }
}

function RouterSetup() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/auth" component={Auth} />
      <Route path="/redirect" component={AuthRedirect} />
      <Route path="/account" component={Account} />
    </Switch>
  );
}

class Home extends React.Component {
  render() {
    return (
      <div>
        <h2>Home</h2>
        <MenuBar />
      </div>
    );
  }
}

class Auth extends React.Component {
  render() {
    window.location.replace('https://eu.battle.net/oauth/authorize?client_id=39658b8731b945fcba53f216556351b6&scope=wow.profile&state=blizzardeumz76c&redirect_uri=http://localhost:3000/redirect/&response_type=code');
    return (
      null
    );
  }
}

class AuthRedirect extends React.Component {
  render() {
    let query = new URLSearchParams(this.props.location.search);
    axios.post('http://127.0.0.1:8000/api/bnetlogin/', { state: query.get('state'), code: query.get('code'), client_id: '39658b8731b945fcba53f216556351b6'})
      .then(response => {
        console.log(response.data);
        cookies.set('userid', response.data['user'], { path: '/', sameSite: 'Lax', secure: true});
      })
      .catch(error => {
        console.log(error);
      })
    return (
      <Redirect to={{
        pathname: "/account",
        state: { alts: 'dawd'} 
      }}/>
    );
  }
}

class Account extends React.Component {
  constructor() {
    super();
    this.state = { data: []};
  }

  async componentDidMount() {
    const response = await axios.get('http://127.0.0.1:8000/api/alts', { user: cookies.get('userid') });
    this.setState({ data: response.data });
  }

  render() {
    return (
      <div>
        <AltTable alts={this.state.data} />
        <p>{this.props.location.state.alts}</p>
      </div>
    );
  }
}

function App() {
  return (
    <BrowserRouter>
      <RouterSetup />
    </BrowserRouter>
    );
}

export default App;

    