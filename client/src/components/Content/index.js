import { Switch, Route } from 'react-router-dom';
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

const Content = () => {
    return (
        <>
            <div className="logo-wrap container position img-bg mt-4">
                <img src={logo} alt="logo" />
                <h2 style={{ paddingLeft: '10px' }} className="text-dark text-center mt-3 mb-3 pb-5 heading">Електронний реєстр апостилів</h2>
            </div>
            <Switch>
                <Route exact path="/" component={Index} />
                <Route path="/apostilles" component={Apostilles} />
                <Route path="/login" component={Login} />
                <Route path="/edit/manager/:id" component={EditManager} />
                <Route path="/create/manager" component={CreateManager} />
                <Route path="/managers" component={Managers} />
                <Route exact path="/edit/:id" component={EditApostille} />
                <Route exact path="/create" component={CreateApostille} />
                <Route path="/actions" component={Actions} />
            </Switch>
        </>
    )
}

export default Content;