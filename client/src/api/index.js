import axios from 'axios';

const baseInstance = axios.create({
    baseURL: 'http://localhost:3456/api/v1',
})

const protectedInstance = axios.create({
    baseURL: 'http://localhost:3456/api/v1',
    withCredentials: true
})

export const findApostille = (number, date) => baseInstance.post('/apostilles/find', { number, date }).then(res => res.data);

export const makeLoginRequest = (email, password) => protectedInstance.post('/auth/login', { email, password }).then(resp => resp.data);

export const getUserRequest = () => protectedInstance.get(`/auth/me`).then(resp => resp.data);

export const logoutRequest = () => protectedInstance.get('/auth/logout').then(resp => resp.data);

export const getAllApostillesQuery = () => protectedInstance.get('/apostilles').then(resp => resp.data);

export const getApostilleQuery = (id) => protectedInstance.get(`/apostilles/get/${id}`).then(resp => resp.data);

export const disableApostilleQuery = (id) => protectedInstance.post('/apostilles/disable', { id }).then(resp => resp.data);

export const editApostilleQuery = (values) => protectedInstance.post('/apostilles/edit', values).then(resp => resp.data);

export const createApostilleQuery = (values) => protectedInstance.post('/apostilles/create', values).then(resp => resp.data);

export const getAllManagersQuery = () => protectedInstance.get('/managers').then(resp => resp.data);

export const disableManagerQuery = (id) => protectedInstance.post('/managers/disable', { id }).then(resp => resp.data);

export const enableManagerQuery = (id) => protectedInstance.post('/managers/enable', { id }).then(resp => resp.data);

export const getManagerQuery = (id) => protectedInstance.get(`/managers/get/${id}`).then(resp => resp.data);

export const editManagerQuery = (values) => protectedInstance.post('/managers/edit', values).then(resp => resp.data);

export const createManagerQuery = (values) => protectedInstance.post('/auth/register', values).then(resp => resp.data);

export const getRecentActionsQuery = () => protectedInstance.get('/managers/logs').then(resp => resp.data);