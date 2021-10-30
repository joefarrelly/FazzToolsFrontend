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

function Header() {
  let disable = false;
  const [update, setUpdate] = useState(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
  function updateAllAlt() {
    axios.post('http://127.0.0.1:8000/api/custom/scanalt/', { userid: cookies.get('userid')});
    cookies.set('lastupdate', new Date().getTime(), { path: '/', sameSite: 'Lax', secure: true});
    setUpdate(new Date(parseInt(cookies.get('lastupdate'))).toLocaleString());
  }

  if (new Date().getTime() < (parseInt(cookies.get('lastupdate')) + 3)) {
    disable = true;
  }

  if (cookies.get('userid')) {
    return (
      <Row>
        <Col>
          <div className="site-header-left">
            <h1>Fazz Tools</h1>
          </div>
        </Col>
        <Col>
          <div className="site-header-right">
            <div className="update-date-div">
              <button disabled={disable} onClick={() => updateAllAlt()}>Update</button>
            </div>
            <div className="update-date-div">Last updated: {update}</div>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <Row>
      <Col>
        <div class="site-header-left">
          <h1>Fazz Tools</h1>
        </div>
      </Col>
    </Row>
  );
}

function AltTable(props) {
  const rows = props.alts.map((row, index) => {
    return <AltTableRow alt={row} key={index} page={props.page}/>;
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
    return <AltTableRowData alt={data} key={index} fullalt={props.alt} page={props.page}/>;
  });
  return (
    <tr>
      <td></td>
      {rowData}
    </tr>
  );
}

function AltTableRowData(props) {
  if (props.page === 'profession') {
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
    return <ProfessionTableRowTemp recipe={data} key={index} />;
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
        <div className="inline-div">
          {rowData}
        </div>
      </Collapse>
    </div>
  );
}

function ProfessionTableRowTemp(props) {
  const [open, setOpen] = useState(false);

  const temps = props.recipe[1];
  const tempData = temps.map((data, index) => {
    return <ProfessionTableRow recipe={data} key={index} />;
  });
  function changeCollapse() {
    setOpen(!open);
  }
  return (
    <div>
      <div>
        <button className="prof-category-collapse-button" type="button" onClick={() => changeCollapse()}>{props.recipe[0]}</button>
      </div>
      <Collapse in={open}>
        <div className="inline-div">
          {tempData}
        </div>
      </Collapse>
    </div>
  );
}


function ProfessionTableRow(props) {
  const [open, setOpen] = useState(false);

  const mats = props.recipe.slice(3).map((mat, index) => {
    return <div className="inline-div" key={index}>&nbsp;{mat[1]}x <img className={mat[3].toLowerCase()} src={mat[2]} title={mat[0]} alt={mat[0]} width="48" height="48" /></div>;
  });

  function changeCollapse() {
    setOpen(!open);
  }

  return (
    <div>
      <div className="inline-div recipe-list" onClick={() => changeCollapse()}>
        <div className="inline-div">
          {props.recipe[0]}<br />
          Rank: {props.recipe[1]} Quantity: {props.recipe[2]}
        </div>
      </div>
      <div className="inline-div">
        <Collapse in={open}>
          <div className="inline-div recipe-mats">
              {mats}
          </div>
        </Collapse>
      </div>
    </div>
  );
}

function MountTable(props) {
  const cols = props.alts.map((col, index) => {
    return <MountTableCol alt={col} key={index} />;
  });
  return (
    <>
      {cols}
    </>
  );
}

function MountTableCol(props) {
  const [open, setOpen] = useState(false);

  const rows = props.alt[1].map((row, index) => {
    return <MountTableRow alt={row} key={index} />;
  });
  function changeCollapse() {
    setOpen(!open);
  }

  return (
    <div>
      <div className="inline-div">
        <button className="mount-collapse-button" type="button" onClick={() => changeCollapse()}>{props.alt[0]}</button>
      </div>
        <Collapse in={open}>
        <div className="inline-div">
          {rows}
        </div>
      </Collapse>
    </div>
  );
}

function MountTableRow(props) {
  return (
    <div className="mount-container">
      <div className="inline-div left">{props.alt[0]}</div>
      <div className="inline-div right epic">
        <img src={props.alt[1]} title={props.alt[0]} alt="No Icon" width="56" height="56" />
      </div>
    </div>
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
          <Link to="/mount">Mount</Link>
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
      <Route path="/mount" component={Mount} />
      <Route path="/logout" component={Logout} />
      <Route path="/:alt/:realm/:profession" children={<SingleProfession />} />
    </Switch>
  );
}

function Home() {
  return (
    <>
      <Header />
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Home</h2>
          <p>Landing page coming at some point.</p>
        </Col>
      </Row>
    </>
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
      const response = await axios.post('http://127.0.0.1:8000/api/custom/bnetlogin/', { state: query.get('state'), code: query.get('code'), client_id: '39658b8731b945fcba53f216556351b6'});
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
  const heads = ['Faction', 'Level', 'Race', 'Class', 'Name', 'Realm'];

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/alts/', { params: { user: cookies.get('userid'), fields: ['altFaction', 'altLevel', 'get_altRace_display', 'get_altClass_display', 'altName', 'altRealm'] }});
      setData(response.data);
    };
    getData();
  }, []);

  return (
    <>
      <Header />
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
          </Row>
          <AltTable alts={data} heads={heads} />
        </Col>
      </Row>
    </>
  );
}

function Weekly() {
  const [data, setData] = useState([]);
  const [heads, setHeads] = useState([]);

  return (
    <>
      <Header />
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
    </>
  );
}

function Gear() {
  const [data, setData] = useState([]);
  const heads = ['Name', 'Realm', 'Avg', 'Head', 'Neck', 'Shoulder', 'Back', 'Chest', 'Tabard', 'Shirt', 'Wrist', 'Hands', 'Belt', 'Legs', 'Feet', 'Ring 1', 'Ring 2', 'Trinket 1', 'Trinket 2', 'Weapon 1', 'Weapon 2'];

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/altequipments/', { params: { user: cookies.get('userid') }});
      setData(response.data);
    };
    getData();
  }, []);

  return (
    <>
      <Header />
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
    </>
  );
}

function Profession() {
  const [data, setData] = useState([]);
  const heads = ['Name', 'Realm', 'Profession 1', 'Profession 2']

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/altprofessions/', { params: { user: cookies.get('userid'), fields: ['.altName', '.altRealm', 'get_profession1_display', 'get_profession2_display'] }});
      setData(response.data);
    };
    getData();
  }, []);

  return (
    <>
      <Header />
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Profession</h2>
          <AltTable alts={data} heads={heads} page={'profession'}/>
        </Col>
      </Row>
    </>
  );
}

function Mount() {
  const [data, setData] = useState([]);
  const heads = []

  useEffect(() => {
    async function getData() {
      const response = await axios.get('http://127.0.0.1:8000/api/profile/usermounts/', { params: { user: cookies.get('userid') }});
      setData(response.data);
    };
    getData();
  }, []);

  return (
    <>
      <Header />
      <Row>
        <Col className="sidebar">
          <div className="sticky-top">
            <MenuBar />
          </div>
        </Col>
        <Col className="main-content">
          <h2>Mount</h2>
          <MountTable alts={data} heads={heads} />
        </Col>
      </Row>
    </>
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
      const response = await axios.get('http://127.0.0.1:8000/api/profile/altprofessiondatas/', { params: { alt: alt, realm: realm, profession: profession }});
      setData(response.data);
    };
    getData();
  }, [alt, realm, profession]);

  return (
    <>
      <Header />
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
    </>
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

    