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
        const apostille = r.recordset[0]
        apostille.date =apostille.date.toISOString().substr(0,10);
        res.status(200).json(apostille);
    } catch(err) {
        res.sendStatus(500);
    }
})

router.post('/disable', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        let { id } = req.body;
        let r = await runPreparedQuery(q.disableApostilleQuery, { id });
        if(r.rowsAffected > 0) {
            await runPreparedQuery(q.pushManagerAction, 
                { registratorId: req.user.id[0], apostilleIdBefore: id, apostilleIdAfter: id, actionTypeId: 3 });
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
        let { signerName, signerPosition, signerInst, sertName, sertPosition, sertInst, signType, id, error, country, date, cityName, number } = req.body;
        let pr = await runPreparedQuery(q.getShortApostilleQuery, { id });
        let tr = await runPreparedQuery(q.checkApostilleQuery, { number });
        if(tr.recordset[0] && (tr.recordset[0].id !== id)) {
            res.status(200).json({ resultCode: 1, message: 'Апостиль з таким номером уже існує'});
            return;
        }
        const signerInstId = await runPreparedQuery(q.getInsitutionIdByName, { institutionName: signerInst});
        const certifierInstId = await runPreparedQuery(q.getInsitutionIdByName, { institutionName: sertInst});
        const signerPosId = await runPreparedQuery(q.getPositionIdByName, { positionName: signerPosition });
        if(!(signerInstId.recordset[0] && certifierInstId.recordset[0] && signerPosId.recordset[0])){
            res.status(200).json({ resultCode: 1, message: 'Немає таких посад або установ'});
            return;
        }
        await runPreparedQuery(q.editSignerQuery, 
            { id: tr.recordset[0].signerId, fullname: signerName, positionId: signerPosId.recordset[0].id, institutionId: signerInstId.recordset[0].id });
        await runPreparedQuery(q.editSertifierQuery, { id: tr.recordset[0].certifierId, fullname: sertName, institutionId: certifierInstId.recordset[0].id });
        let r = await runPreparedQuery(q.editApostilleQuery, { id, date, cityName, number });
        await runPreparedQuery(q.pushManagerAction, 
            { registratorId: req.user.id[0], apostilleIdBefore: pr.recordset[0].number, apostilleIdAfter: number, actionTypeId: 4 });
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
        let sgr = await runPreparedQuery(q.createSignerQuery, { fullname: signerName, positionId: signerPosition, institutionId: signerInst });
        let str = await runPreparedQuery(q.createSertifierQuery, { fullname: sertName, institutionId: sertInst });
        let r = await runPreparedQuery(q.createApostilleQuery, { ...fields, signerId: sgr.recordset[0].id, certifierId: str.recordset[0].id });
        
        if(r.rowsAffected.length > 0) {
            await runPreparedQuery(q.pushManagerAction, 
                { registratorId: req.user.id[0], apostilleIdBefore:  r.recordset[0].id, apostilleIdAfter:  r.recordset[0].id, actionTypeId: 5 });
            res.status(200).json({ resultCode: 0 });
        }
        else res.status(200).json({ resultCode: 1 });
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = router;