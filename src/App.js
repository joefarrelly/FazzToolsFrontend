import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cookies = new Cookies();

class AltTable extends React.Component {
  render() {
    const rows = this.props.alts.map((row, index) => {
      return <AltTableRow alt={row} key={index}/>;
    });
    const cols = this.props.heads.map((col, index) => {
      return <AltTableHead head={col} key={index}/>;
    });

    return (
      <div>
        <table className="alt-table">
          <tbody>
            <tr>
              <th>#</th>
              {cols}
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

class AltTableHead extends React.Component {
  render() {
    return (
      <th>{this.props.head}</th>
    );
  }
}

class AltTableRow extends React.Component {
  render() {
    const alt = Object.values(this.props.alt);
    const rowData = alt.map((data, index) => {
      return <AltTableRowData alt={data} key={index}/>;
    });
    return (
      <tr>
        <td></td>
        {rowData}
      </tr>
    );
  }
}

class AltTableRowData extends React.Component {
  render() {
    return (
      <td>
        {this.props.alt}
      </td>
    );
  }
}

class MenuBar extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/">Home</Link>
        </div>
        <LoginLogout />
      </div>
    );
  }
}

class LoginLogout extends React.Component {
  render() {
    if (cookies.get('userid')) {
      return (
        <>
          <div>
            <Link to="/account">Account</Link>
          </div>
          <div>
            <Link to="/weekly">Weekly</Link>
          </div>
          <div>
            <Link to="/gear">Gear</Link>
          </div>
          <div>
            <Link to="/profession">Profession</Link>
          </div>
          <div>
            <Link to="/achievement">Achievement</Link>
          </div>
          <div>
            <Link to="/logout">Logout</Link>
          </div>
        </>
      );
    }
    return (
      <div>
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
      <Route path="/weekly" component={Weekly} />
      <Route path="/gear" component={Gear} />
      <Route path="/profession" component={Profession} />
      <Route path="/achievement" component={Achievement} />
      <Route path="/logout" component={Logout} />
    </Switch>
  );
}

class Home extends React.Component {
  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Home</h2>
        </Col>
      </Row>
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
  constructor(props) {
    super(props);
    this.state = { readyToRedirect: false };
  }
  async componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const response = await axios.post('http://127.0.0.1:8000/api/bnetlogin/', { state: query.get('state'), code: query.get('code'), client_id: '39658b8731b945fcba53f216556351b6'});
    cookies.set('userid', response.data['user'], { path: '/', sameSite: 'Lax', secure: true});
    this.setState({ readyToRedirect: true });
  }
  render() {
    if (this.state.readyToRedirect) return <Redirect to="/account" />

    return (
      null
    );
  }
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], heads: []};
  }

  async componentDidMount() {
    const response = await axios.get('http://127.0.0.1:8000/api/alts/', { params: { user: cookies.get('userid') }});
    this.setState({ data: response.data, heads: Object.keys(response.data[0]) });
  }

  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Account</h2>
          <AltTable alts={this.state.data} heads={this.state.heads}/>
        </Col>
      </Row>
    );
  }
}

class Weekly extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], heads: []};
  }

  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Weekly</h2>
          <AltTable alts={this.state.data} heads={this.state.heads}/>
        </Col>
      </Row>
    );
  }
}

class Gear extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], heads: []};
  }

  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Gear</h2>
          <AltTable alts={this.state.data} heads={this.state.heads}/>
        </Col>
      </Row>
    );
  }
}

class Profession extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], heads: []};
  }

  async componentDidMount() {
    const response = await axios.get('http://127.0.0.1:8000/api/altprofessions/', { params: { user: cookies.get('userid') }});
    this.setState({ data: response.data, heads: Object.keys(response.data[0]) });
  }

  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Profession</h2>
          <AltTable alts={this.state.data} heads={this.state.heads}/>
        </Col>
      </Row>
    );
  }
}

class Achievement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [], heads: []};
  }

  render() {
    return (
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Achievement</h2>
          <AltTable alts={this.state.data} heads={this.state.heads}/>
        </Col>
      </Row>
    );
  }
}

class Logout extends React.Component {
  componentDidMount() {
    cookies.remove('userid', { path: '/', sameSite: 'Lax', secure: true});
  }

  render() {
    return (
      <Redirect to="/" />
    );
  }
}

function App() {
  return (
    <BrowserRouter>
      <Container fluid>
        <RouterSetup />
      </Container>
    </BrowserRouter>
    );
}

export default App;

    