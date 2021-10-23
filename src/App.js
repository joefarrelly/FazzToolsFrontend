import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Collapse from 'react-bootstrap/Collapse';

const cookies = new Cookies();

function AltTable(props) {
  const rows = props.alts.map((row, index) => {
    return <AltTableRow alt={row} key={index}/>;
  });
  const cols = props.heads.map((col, index) => {
    return <th key={index}>{col}</th>;
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

function AltTableRow(props) {
  const alt = Object.values(props.alt);
  const rowData = alt.map((data, index) => {
    return <AltTableRowData alt={data} key={index} fullalt={props.alt}/>;
  });
  return (
    <tr>
      <td></td>
      {rowData}
    </tr>
  );
}

function AltTableRowData(props) {
  if (props.fullalt.length === 4) {
    if (props.alt === props.fullalt[2] && props.fullalt[2] !== 'Missing') {
      return (
        <td><Link to={`/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase()}/${props.fullalt[2].toLowerCase()}`}>{props.fullalt[2]}</Link></td>   
      );
    } else if (props.alt === props.fullalt[3] && props.fullalt[3] !== 'Missing') {
      return (
        <td><Link to={`/${props.fullalt[0].toLowerCase()}/${props.fullalt[1].toLowerCase()}/${props.fullalt[3].toLowerCase()}`}>{props.fullalt[3]}</Link></td>   
      );
    }
  }
  return (
    <td>
      {props.alt}
    </td>
  );
}

function ProfessionTable(props) {
  const tableData = props.tiers.map((data, index) => {
    return <ProfessionTableCol tier={data} key={index} />;
  });
  return (
    <>
      {tableData}
    </>
  );
}

function ProfessionTableCol(props) {
  const [open, setOpen] = useState(false);

  const rows = props.tier[1];
  const rowData = rows.map((data, index) => {
    return <ProfessionTableRow recipe={data} key={index} />;
  });
  function changeCollapse() {
    setOpen(!open);
  }
  return (
    <div>
      <div className="inline-div">
        <button className="prof-collapse-button" type="button" onClick={() => changeCollapse()}>{props.tier[0]}</button>
      </div>
      <Collapse in={open}>
        <div className="inline-div content">
          <table className="prof-table">
            <tbody>
              {rowData}
            </tbody>
          </table>
        </div>
      </Collapse>
    </div>
  );
}

function ProfessionTableRow(props) {
  return (
    <tr>
      <td>
        {props.recipe}
      </td>
    </tr>
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
      <Route path="/:alt/:realm/:profession" children={<SingleProfession />} />
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
  let disable = false;
  const [update, setUpdate] = useState(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
  function updateAllAlt() {
    axios.post('http://127.0.0.1:8000/api/scanalt/', { userid: cookies.get('userid')});
    cookies.set('lastupdate', new Date().getTime(), { path: '/', sameSite: 'Lax', secure: true});
    setUpdate(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
  }
  const [data, setData] = useState([]);
  const heads = ['Faction', 'Level', 'Race', 'Class', 'Name', 'Realm'];

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/alts/', { params: { user: cookies.get('userid'), fields: ['altFaction', 'altLevel', 'get_altRace_display', 'get_altClass_display', 'altName', 'altRealm'] }});
      setData(response.data);
    };
    getData();
  }, []);
  if (new Date().getTime() < (parseInt(cookies.get('lastupdate')) + 300000)) {
    disable = true;
  }
  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <Row>
          <Col>
            <h2>Account</h2>
          </Col>
          <Col>
            <div>
              <div className="update-date-div">
                <button disabled={disable} onClick={() => updateAllAlt()}>Update</button>
              </div>
              <div className="update-date-div">Last updated: {update}</div>
            </div>
          </Col>
        </Row>
        <AltTable alts={data} heads={heads} />
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
  const heads = ['Name', 'Realm', 'Profession 1', 'Profession 2']

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/altprofessions/', { params: { user: cookies.get('userid'), fields: ['.altName', '.altRealm', 'get_profession1_display', 'get_profession2_display'] }});
      setData(response.data);
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
        <AltTable alts={data} heads={heads} />
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

  const { alt, realm, profession } = useParams();

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/altprofessiondatas/', { params: { alt: alt, realm: realm, profession: profession }});
      setData(response.data);
    };
    getData();
  }, [alt, realm, profession]);

  return (
    <Row>
      <Col className="sidebar">
        <div className="sticky-top">
          <MenuBar />
        </div>
      </Col>
      <Col className="main-content">
        <h2>{alt.replace(alt[0], alt[0].toUpperCase())} - {realm.replace(realm[0], realm[0].toUpperCase())}: {profession.replace(profession[0], profession[0].toUpperCase())}</h2>
        <ProfessionTable tiers={data} />
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

    