import React from 'react';
import { connect } from 'react-redux';
import { getAuth, getUser } from '../services/reducers';
import { login, logout } from '../services/actions';

const withAuth = (Component) => {

    let ComponentWithAuth = (props) => (
        <Component {...props} />
    );

    const mapStateToProps = (state) => ({
        hasAuth: getAuth(state),
        user: getUser(state)
    })

    return connect(mapStateToProps, { login, logout })(ComponentWithAuth);
}

export default withAuth;