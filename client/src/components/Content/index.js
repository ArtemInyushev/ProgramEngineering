import { Switch, Route, Redirect } from 'react-router-dom';
import { getUserRequest } from '../../api';
import { useEffect, useState } from 'react';
import Index from '../../pages/Index';
import Apostilles from '../../pages/Apostilles';
import Login from '../../pages/Login';
import CreateManager from '../../pages/CreateManager';
import EditManager from '../../pages/EditManager';
import CreateApostille from '../../pages/CreateApostille';
import EditApostille from '../../pages/EditApostille';
import Managers from '../../pages/Managers';
import Actions from '../../pages/Actions';
import logo from '../../assets/logom.png';
import withAuth from '../../hocs/withAuth';

function PrivateRoute ({component: Component, authed, ...rest}) {
    return (
      <Route
        {...rest}
        render={(props) => authed === true
          ? <Component {...props} />
          : <Redirect to={{pathname: '/login'}} />}
      />
    )
}

const Content = ({ hasAuth, login }) => {
    const [init, setState] = useState(null);
    
    useEffect(() => (async () => {
        const getData = async () => {
            try{
                let r = await getUserRequest();
                if(r.resultCode === 0) {
                    login(r.data);
                }
                setState(true);
            }
            catch(err){
                setState(false)
            }
        }
        if(!hasAuth) await getData();
    })(),[login, hasAuth]);

    if(init === null){
        return null;
    }
      
    return (
        <>
            <div className="logo-wrap container position img-bg mt-4">
                <img src={logo} alt="logo" />
                <h2 style={{ paddingLeft: '10px' }} className="text-dark text-center mt-3 mb-3 pb-5 heading">Електронний реєстр апостилів</h2>
            </div>
            <Switch>
                <PrivateRoute authed={init} exact path="/" component={Index} />
                <PrivateRoute authed={init} path="/apostilles" component={Apostilles} />
                <Route path="/login" component={Login} />
                <PrivateRoute authed={init} path="/edit/manager/:id" component={EditManager} />
                <Route path="/create/manager" component={CreateManager} />
                <PrivateRoute authed={init} path="/managers" component={Managers} />
                <PrivateRoute authed={init} exact path="/edit/:id" component={EditApostille} />
                <PrivateRoute authed={init} exact path="/create" component={CreateApostille} />
                <PrivateRoute authed={init} path="/actions" component={Actions} />
            </Switch>
        </>
    );
}

export default withAuth(Content);