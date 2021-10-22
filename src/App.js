import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const cookies = new Cookies();

function AltTable(props) {
  function updateAllAlt() {
    console.log(props);
  }
  const rows = props.alts.map((row, index) => {
    return <AltTableRow alt={row} key={index} buttons={props.buttons}/>;
  });
  const cols = props.heads.map((col, index) => {
    return <AltTableHead head={col} key={index}/>;
  });
  if (props.buttons && props.heads[0] === "altId") {
    return (
      <div>
        <table className="alt-table">
          <tbody>
            <tr>
              <th>#</th>
              {cols}
              <th><button onClick={() => updateAllAlt()}>Update All</button></th>
            </tr>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
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

function AltTableHead(props) {
  return (
    <th>{props.head}</th>
  );
}

function AltTableRow(props) {
  function updateAlt(altId) {
    const response = axios.post('http://127.0.0.1:8000/api/scanalt/', { altId: altId});
  }
  const alt = Object.values(props.alt);
  const rowData = alt.map((data, index) => {
    return <AltTableRowData alt={data} key={index} buttons={props.buttons} fullalt={props.alt}/>;
  });
  if (props.buttons && props.alt.altId) {
    return (
      <tr>
        <td></td>
        {rowData}
        <td><button onClick={() => updateAlt(props.alt.altId)}>Update</button></td>
      </tr>
    );
  }
  return (
    <tr>
      <td></td>
      {rowData}
    </tr>
  );
}

function AltTableRowData(props) {
  if (props.buttons) {
    if (props.alt !== props.fullalt.alt) {
      if (props.alt === props.fullalt.profession1 && props.fullalt.profession1 !== 0) {
        return (
          <td><Link to={`/profession/${props.fullalt.alt}/${props.fullalt.profession1}`}>{props.alt}</Link></td>   
        );
      } else if (props.alt === props.fullalt.profession2 && props.fullalt.profession2 !== 0) {
        return (
          <td><Link to={`/profession/${props.fullalt.alt}/${props.fullalt.profession2}`}>{props.alt}</Link></td>   
        );
      }
    }
  }
  return (
    <td>
      {props.alt}
    </td>
  );
}

function MenuBar() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <LoginLogout />
    </div>
  );
}

function LoginLogout() {
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

function RouterSetup() {
  return (
    <Switch>
      <Route path="/" component={Home} exact />
      <Route path="/auth" component={Auth} />
      <Route path="/redirect" component={AuthRedirect} />
      <Route path="/account" component={Account} />
      <Route path="/weekly" component={Weekly} />
      <Route path="/gear" component={Gear} />
      <Route path="/profession" component={Profession} exact />
      <Route path="/achievement" component={Achievement} />
      <Route path="/logout" component={Logout} />
      <Route path="/profession/:alt/:profession" children={<SingleProfession />} />
    </Switch>
  );
}

function Home() {
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

function Auth() {
  window.location.replace('https://eu.battle.net/oauth/authorize?client_id=39658b8731b945fcba53f216556351b6&scope=wow.profile&state=blizzardeumz76c&redirect_uri=http://localhost:3000/redirect/&response_type=code');
  return (
    null
  );
}

function AuthRedirect() {
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function getData() {
      const query = new URLSearchParams(location.search);
      const response = await axios.post('http://127.0.0.1:8000/api/bnetlogin/', { state: query.get('state'), code: query.get('code'), client_id: '39658b8731b945fcba53f216556351b6'});
      cookies.set('userid', response.data['user'], { path: '/', sameSite: 'Lax', secure: true});
      setReadyToRedirect(true);
    };
    getData();
  }, [location]);

  if (readyToRedirect) return <Redirect to="/account" />
  return (
    null
  );
}

function Account() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/alts/', { params: { user: cookies.get('userid') }});
      setData(response.data);
      setHeads(Object.keys(response.data[0]));
    };
    getData();
  }, []);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Account</h2>
        <AltTable alts={data} heads={heads} buttons={true}/>
      </Col>
    </Row>
  );
}

function Weekly() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Weekly</h2>
        <AltTable alts={data} heads={heads}/>
      </Col>
    </Row>
  );
}

function Gear() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Gear</h2>
        <AltTable alts={data} heads={heads}/>
      </Col>
    </Row>
  );
}

function Profession() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/altprofessions/', { params: { user: cookies.get('userid') }});
      setData(response.data);
      setHeads(Object.keys(response.data[0]));
    };
    getData();
  }, []);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Profession</h2>
        <AltTable alts={data} heads={heads} buttons={true}/>
      </Col>
    </Row>
  );
}

function Achievement() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Achievement</h2>
        <AltTable alts={data} heads={heads}/>
      </Col>
    </Row>
  );
}

function Logout() {
  useEffect(() => {
    cookies.remove('userid', { path: '/', sameSite: 'Lax', secure: true});
  });
  return (
    <Redirect to="/" />
  );
}

function SingleProfession() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  const { alt, profession } = useParams();

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/altprofessiondatas/', { params: { alt: alt, profession: profession }});
      setData(response.data);
      setHeads(Object.keys(response.data[0]));
    };
    getData();
  }, [alt, profession]);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>Single Profession</h2>
        <AltTable alts={data} heads={heads} />
      </Col>
    </Row>
  );
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

    