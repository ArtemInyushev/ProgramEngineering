const express = require('express');
const router = express.Router();
const passport = require('passport');
const { runQuery, runPreparedQuery } = require('../config/db');
const q = require('../queries/queries');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let r = await runQuery(q.getManagersQuery);
        res.status(200).json(r.recordset);
    } catch(err) {
        res.sendStatus(500);
    }
});

router.get('/get/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.params;
        let r = await runPreparedQuery(q.getManagerQuery, { id: Number(id) });
        res.status(200).json(r.recordset[0]);
    } catch(err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.post('/edit', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { email, password, id, ...fields } = req.body;
        let ptr = await runPreparedQuery(q.checkPassportQuery, { number: fields.number, taxNumber: null });
        if(ptr.recordset.length > 0 && ptr.recordset[0].id !== id[1]) {
            res.status(200).json({ resultCode: 1, message: "Реєстратор з таким номером паспорту уже існує" });
        }
        let ptr2 = await runPreparedQuery(q.checkPassportQuery, { taxNumber: fields.taxNumber, number: null });
        if(ptr2.recordset.length > 0 && ptr2.recordset[0].id !== id[1]) {
            res.status(200).json({ resultCode: 1, message: "Реєстратор з таким номером платника податків уже існує" });
        }
        let mtr = await runPreparedQuery(q.getShortManagerQuery, { id: id[0] });
        let pr = await runPreparedQuery(q.editPassportQuery, { ...fields, id: mtr.recordset[0].passport });
        let r = await runPreparedQuery(q.editManagerQuery, { email, password, id: id[0] });
        if(r.rowsAffected > 0) res.status(200).json({ resultCode: 0 });
        else res.status(200).json({ resultCode: 1 });
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
})

router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let r = await runPreparedQuery(createManager, { ...req.body });
        if(r.rowsAffected > 0) res.status(200).json({ resultCode: 0 });
        else res.status(200).json({ resultCode: 1 });
    }
    catch (err) {
        res.sendStatus(500);
    }
})

router.post('/disable', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.body;
        let r = await runPreparedQuery(q.disableManagerQuery, { id });
        if(r.rowsAffected > 0) {
            res.status(200).json({ resultCode: 0 });
        } else {
            res.status(200).json({ resultCode: 1 });
        }
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/enable', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.body;
        let r = await runPreparedQuery(q.enableManagerQuery, { id });
        if(r.rowsAffected > 0) {
            res.status(200).json({ resultCode: 0 });
        } else {
            res.status(200).json({ resultCode: 1 });
        }
    } catch(err) {
        res.sendStatus(500);
    }
})

router.get('/logs', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let lr = await runQuery(q.getAuthActionLogs);
        let lr2 = await runQuery(q.getRecordsActionLogs);
        res.status(200).json(lr.recordset.concat(lr2.recordset));
    } catch(err) {
        res.sendStatus(500);
    }
})

module.exports = router;