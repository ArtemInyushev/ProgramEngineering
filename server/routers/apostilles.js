const express = require('express');
const router = express.Router();
const passport = require('passport');
const { runQuery, runPreparedQuery } = require('../config/db');
const q = require('../queries/queries');

router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let r = await runQuery(q.getApostillesQuery);
        res.status(200).json(r.recordset);
    } catch(err) {
        res.sendStatus(500);
    }
});

router.get('/get/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.params;
        let r = await runPreparedQuery(q.getApostilleQuery, { id: Number(id) });
        res.status(200).json(r.recordset[0]);
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/disable', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.body;
        let r = await runPreparedQuery(q.disableApostilleQuery, { id });
        if(r.rowsAffected > 0) {
            await runPreparedQuery(q.pushManagerAction, { manager: req.user.id[0], record: id, type: "Анулювання апостиля" });
            res.status(200).json({ resultCode: 0 });
        } else {
            res.status(200).json({ resultCode: 1 });
        }
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/find', async(req, res) => {
    let { number, date } = req.body;

    try {
        let a = await runPreparedQuery(q.findApostilleQuery, { number, date: '%' + date + '%' });
        res.status(200).json({ resultCode: 0, response: a.recordset });
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/edit', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { signerName, signerPosition, signerInst, sertName, sertPosition, sertInst, signType, id, error, country, date, city, number } = req.body;
        let pr = await runPreparedQuery(q.getShortApostilleQuery, { id });
        let tr = await runPreparedQuery(q.checkApostilleQuery, { number });
        if(tr.recordset[0] && (pr.recordset[0].id !== tr.recordset[0].id)) {
            res.status(200).json({ resultCode: 1, message: 'Апостиль з таким номером уже існує'});
            return;
        }
        let sgr = await runPreparedQuery(q.editSignerQuery, { id: pr.recordset[0].signer, fullname: signerName, position: signerPosition, inst: signerInst });
        let str = await runPreparedQuery(q.editSertifierQuery, { id: pr.recordset[0].sertifier, fullname: sertName, position: sertPosition, inst: sertInst, st: signType });
        let r = await runPreparedQuery(q.editApostilleQuery, { id, country, date, city, number });
        await runPreparedQuery(q.pushManagerAction, { manager: req.user.id[0], record: id, type: "Зміна даних апостиля" });
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
        let { signerName, signerPosition, signerInst, sertName, sertPosition, sertInst, signType, ...fields } = req.body;
        let sgr = await runPreparedQuery(q.createSignerQuery, { fullname: signerName, position: signerPosition, inst: signerInst });
        let str = await runPreparedQuery(q.createSertifierQuery, { fullname: sertName, position: sertPosition, inst: sertInst, st: signType });
        let r = await runPreparedQuery(q.createApostilleQuery, { ...fields, signer: sgr.recordset[0].id, sertifier: str.recordset[0].id });
        
        if(r.rowsAffected.length > 0) {
            await runPreparedQuery(q.pushManagerAction, { manager: req.user.id[0], record: r.recordset[0].id, type: "Створення запису апостиля" });
            res.status(200).json({ resultCode: 0 });
        }
        else res.status(200).json({ resultCode: 1 });
    }
    catch (err) {
        res.sendStatus(500);
    }
})

module.exports = router;