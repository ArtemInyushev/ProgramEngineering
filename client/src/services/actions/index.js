import * as types from '../types';

export const login = (user) => ({
    type: types.LOGIN,
    user
})

export const logout = () => ({
    type: types.LOGOUT
})