import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import withAuth from '../../hocs/withAuth';
import { logoutRequest } from '../../api';

const Header = ({ hasAuth, user, logout }) => {

    const logOut = async () => {
        await logoutRequest();
        document.cookie = "token=";
        logout();
    }

    let username = user && user.fullname.split(' ');

    return (
        <nav className="navbar navbar-expand-lg navbar-light p-0 border-bottom border-dark">
            <div className="d-flex align-items-center">
                <Link to="/"><img src={logo} alt="logo" className="logo" /></Link>
            </div>
            {hasAuth && user.roleId === 1 && <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link" to="/apostilles">Апостилі</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/create'>Створити апостиль</Link>
                </li>
            </ul>}
            {hasAuth && user.roleId === 2 && <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                    <Link className="nav-link" to="/managers">Реєстратори</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/create/manager'>Додати Реєстратора</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/actions'>Нещодавні події</Link>
                </li>
            </ul>}
            {!hasAuth ? <div className="container-fluid">
                <div style={{ marginLeft: 'auto' }} className="text-right text-secondary d-flex justify-content-end align-items-center">
                    <Link className="login-button" to="/login"><i className="fas fa-key"></i> Увійти</Link>
                </div>
            </div> : <div className="ml-auto">
                <div className="d-flex align-items-center">
                    <div className="nav-link text-dark">
                        {username[0]} {username[1] && username[1][0].toUpperCase()}. {username[2] && username[2][0].toUpperCase()}.
                    </div>
                    <div className="btn btn-dark" onClick={logOut}>Logout</div>
                </div>
            </div>}
        </nav> 
    )
}

export default withAuth(Header);