const express = require('express');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');

const router = express.Router();

const { runPreparedQuery } = require('../config/db');
const q = require('../queries/queries');

const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) token = req.cookies['token'];
    return token;
};

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
}

const generateJwtToken = (userData) => {
    const signature = process.env.JWT_SECRET;

    const token = jwt.sign(userData, signature, {
        expiresIn: '24h'
    });

    return token;
}

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    let user = req.user;
    res.status(200).json({ resultCode: 0, data: user });
})

router.get('/logout', passport.authenticate('jwt', { session: false }), async (req, res) =>{
    try {
        if(req.user.roleId === 1) {
            await runPreparedQuery(q.pushManagerAction, 
                { registratorId: req.user.id[0], apostilleIdBefore: null, apostilleIdAfter: null, actionTypeId: 2 });
        }
        res.json({ resultCode: 0 });
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    try {
        const checkUser = await runPreparedQuery(q.userDataQuery, { email: '%' + email + '%', password: '%' + password + '%' });
        if(checkUser.recordset.length > 0) {
            const correctPassword = checkUser.recordset[0].password === password;
            if(correctPassword) {
                if(!checkUser.recordset[0].isActive){
                    res.status(200).json({ resultCode: 1, message: "Inactive" });
                    return;
                }
                if(checkUser.recordset[0].roleId === 1) {
                    await runPreparedQuery(q.pushManagerAction, 
                        { registratorId: checkUser.recordset[0].id[0], apostilleIdBefore: null, apostilleIdAfter: null, actionTypeId: 1 });
                }
                let token = generateJwtToken({ email });
                res.status(200).cookie('token', token, {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    secure: false, // set to true if your using https
                    httpOnly: false,
                }).json({ resultCode: 0 });
            } else {
                res.status(200).json({ resultCode: 1, message: "Invalid email or password" });
            }
        } else {
            res.status(200).json({ resultCode: 1, message: "Invalid email or password" });
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

router.post('/register', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let { email, password, roleId, seriesNumber, ...fields } = req.body;

    if(email === password) {
        res.json({ resultCode: 1, message: "Пароль не повинен співпадати з почтою" });
        return;
    }
    try {
        let ptr = await runPreparedQuery(q.checkPassportQuery, { passportNumber: fields.passportNumber, taxpayerNumber: null });
        if(ptr.recordset.length > 0) {
            res.status(200).json({ resultCode: 1, message: "Реєстратор з таким номером паспорту уже існує" });
        }
        let ptr2 = await runPreparedQuery(q.checkPassportQuery, { taxpayerNumber: fields.taxpayerNumber, passportNumber: null });
        if(ptr2.recordset.length > 0) {
            res.status(200).json({ resultCode: 1, message: "Реєстратор з таким номером платника податків уже існує" });
        }
        let resp = await runPreparedQuery(q.checkManagerQuery, { email: '%' + email + '%' });
        if (resp.recordset.length > 0) {
            res.status(200).json({ resultCode: 1, message: "Вказана почтова адреса уже зайнята" });
        } else {
            console.log(fields);
            const pr = await runPreparedQuery(q.createPassportDataQuery, 
                                                   {...fields, seriesNumber: seriesNumber === '' ? null : seriesNumber });
            const result = await runPreparedQuery(q.createManagerQuery, { email, password, passportData: pr.recordset[0].id });
            if(result.rowsAffected[0] > 0) {
                res.status(201).json({ resultCode: 0 });
            } else {
                res.status(201).json({ resultCode: 1 });
            }
        }
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

passport.use(new JwtStrategy(jwtOptions, async function(jwt_payload, done) {
    try {
        let { email } = jwt_payload;
        let currUser = await runPreparedQuery(q.userDataUnprotectedQuery, { email: '%' + email + '%' });
        if(currUser.recordset.length > 0) {
            return done(null, currUser.recordset[0]);
        } else {
            return done(null, false);
        }
    } catch(err) {
        return done(err, false);
    }
}))

module.exports = router;