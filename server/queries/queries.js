const findApostilleQuery = `SELECT A.id, E.countryName, A.date, D.cityName, A.number, A.isActive, B.fullname AS signerName, 
F.positionName AS signerPosition, I.institutionName AS signerInst, C.fullname AS sertName, 
J.institutionName AS sertInst FROM ProgramEngineering.dbo.Apostilles A 
FULL OUTER JOIN ProgramEngineering.dbo.Signers B ON A.signerId = B.id
FULL OUTER JOIN ProgramEngineering.dbo.Certifiers C ON A.certifierId = C.id 
INNER JOIN ProgramEngineering.dbo.Cities D ON A.cityId = D.id 
INNER JOIN ProgramEngineering.dbo.Countries E ON D.countryId = E.id 
INNER JOIN ProgramEngineering.dbo.Positions F ON B.positionId = F.id
INNER JOIN ProgramEngineering.dbo.Institutions I ON B.institutionId = I.id
INNER JOIN ProgramEngineering.dbo.Institutions J ON C.institutionId = J.id
WHERE A.number = @number AND A.date LIKE @date`;
const checkApostilleQuery = `SELECT * FROM ProgramEngineering.dbo.Apostilles WHERE number = @number;`;
/*const checkApostilleQuery = `SELECT A.id, E.countryName, A.date, D.cityName, A.number, A.isActive, B.fullname AS signerName, 
B.positionId AS signerPosition, B.institutionId AS signerInst, C.fullname AS sertName, 
C.institutionId AS sertIns FROM ProgramEngineering.dbo.Apostilles A 
FULL OUTER JOIN ProgramEngineering.dbo.Signers B ON A.signerId = B.id
FULL OUTER JOIN ProgramEngineering.dbo.Certifiers C ON A.certifierId = C.id 
INNER JOIN ProgramEngineering.dbo.Cities D ON A.cityId = D.id 
INNER JOIN ProgramEngineering.dbo.Countries E ON D.countryId = E.id
WHERE A.number = 234`;*/
const getApostilleQuery = `SELECT A.id, Countries.countryName, A.date, Cities.cityName, A.number, A.isActive, 
B.fullname AS signerName, D.positionName AS signerPosition, E.institutionName AS signerInst, 
C.fullname AS sertName, F.institutionName AS sertInst FROM ProgramEngineering.dbo.Apostilles A
FULL OUTER JOIN ProgramEngineering.dbo.Signers B ON A.signerId = B.id
FULL OUTER JOIN ProgramEngineering.dbo.Certifiers C ON A.certifierId = C.id 
INNER JOIN ProgramEngineering.dbo.Positions D ON B.positionId = D.id 
INNER JOIN ProgramEngineering.dbo.Institutions E ON B.institutionId = E.id 
INNER JOIN ProgramEngineering.dbo.Institutions F ON C.institutionId = F.id 
INNER JOIN ProgramEngineering.dbo.Cities ON A.cityId = Cities.id 
INNER JOIN ProgramEngineering.dbo.Countries ON Cities.countryId = Countries.id 
WHERE A.id = @id`;
const getShortApostilleQuery = 'SELECT * FROM ProgramEngineering.dbo.Apostilles WHERE id = @id';
const userDataQuery = `SELECT * FROM ProgramEngineering.dbo.Staff A
INNER JOIN ProgramEngineering.dbo.PassportData B ON A.passportData = B.id
WHERE email LIKE @email AND password LIKE @password`;
const userDataUnprotectedQuery = `SELECT * FROM ProgramEngineering.dbo.Staff A
INNER JOIN ProgramEngineering.dbo.PassportData B ON A.passportData = B.id
WHERE email LIKE @email`;
const getApostillesQuery = `SELECT * FROM ProgramEngineering.dbo.Apostilles A
INNER JOIN ProgramEngineering.dbo.Signers B ON A.signerId = B.id
INNER JOIN ProgramEngineering.dbo.Certifiers C ON A.certifierId = C.id
INNER JOIN ProgramEngineering.dbo.Positions D ON B.positionId = D.id
INNER JOIN ProgramEngineering.dbo.Institutions E ON B.institutionId = E.id 
INNER JOIN ProgramEngineering.dbo.Institutions F ON C.institutionId = F.id
INNER JOIN ProgramEngineering.dbo.Cities G ON A.cityId = G.id 
INNER JOIN ProgramEngineering.dbo.Countries I ON G.countryId = I.id`;
const disableApostilleQuery = `UPDATE ProgramEngineering.dbo.Apostilles SET isActive = 0 WHERE id = @id`;
const editSignerQuery = `UPDATE ProgramEngineering.dbo.Signers SET fullname = @fullname,
positionId = @positionId, institutionId = @institutionId WHERE id = @id`;
const createSignerQuery = `INSERT INTO ProgramEngineering.dbo.Signers (fullname, positionId, institutionId)
VALUES(@fullname, @positionId, @institutionId)
SELECT SCOPE_IDENTITY() AS id`;
const editSertifierQuery = `UPDATE ProgramEngineering.dbo.Certifiers SET fullname = @fullname, 
institutionId = @institutionId WHERE id = @id`;
const createSertifierQuery = `INSERT INTO ProgramEngineering.dbo.Certifiers (fullname, institutionId)
VALUES(@fullname, @institutionId)
SELECT SCOPE_IDENTITY() AS id`
const editApostilleQuery = `UPDATE ProgramEngineering.dbo.Apostilles 
SET cityId = (SELECT id FROM ProgramEngineering.dbo.Cities WHERE cityName LIKE @cityName), 
date = @date, number = @number WHERE id = @id`;
const createApostilleQuery = `INSERT INTO ProgramEngineering.dbo.Apostilles (signerId, certifierId, date, cityId, number, isActive)
VALUES (@signerId, @certifierId, @date, 
(SELECT id FROM ProgramEngineering.dbo.Cities WHERE cityName LIKE @cityName AND 
countryId = (SELECT id FROM ProgramEngineering.dbo.Countries WHERE countryName LIKE @countryName)), @number, 1)
SELECT SCOPE_IDENTITY() AS id`;
const pushManagerAction = `INSERT INTO ProgramEngineering.dbo.Actions 
(registratorId, apostilleIdBefore, apostilleIdAfter, date, actionTypeId) 
VALUES (@registratorId, @apostilleIdBefore, @apostilleIdAfter, GETDATE(), @actionTypeId)`;

const getManagersQuery = `SELECT * FROM ProgramEngineering.dbo.Staff A
INNER JOIN ProgramEngineering.dbo.PassportData B ON A.passportData = B.id
WHERE A.roleId = 1`;
const disableManagerQuery = `UPDATE ProgramEngineering.dbo.Staff SET isActive = 0 WHERE id = @id`;
const enableManagerQuery = "UPDATE ProgramEngineering.dbo.Staff SET isActive = 1 WHERE id = @id";
const getManagerQuery = `SELECT * FROM ProgramEngineering.dbo.Staff A
FULL OUTER JOIN ProgramEngineering.dbo.PassportData B ON A.passportData = B.id
WHERE A.id = @id AND roleId = 1`;
const editPassportQuery = `UPDATE ProgramEngineering.dbo.PassportData SET fullname = @fullname,
organId = @organId, date = @date, birthday = @birthday, passportNumber = @passportNumber, 
taxpayerNumber = @taxpayerNumber, seriesNumber = @seriesNumber 
WHERE id = @id`;
const getShortManagerQuery = "SELECT * FROM ProgramEngineering.dbo.Staff WHERE id = @id";
const editManagerQuery = `UPDATE ProgramEngineering.dbo.Staff SET email = @email, password = @password
WHERE id = @id`;
const checkPassportQuery = `SELECT * FROM ProgramEngineering.dbo.PassportData WHERE 
passportNumber = @passportNumber OR taxpayerNumber = @taxpayerNumber`;
const checkManagerQuery = "SELECT * FROM ProgramEngineering.dbo.Staff WHERE email LIKE @email";
const createPassportDataQuery = `INSERT INTO ProgramEngineering.dbo.PassportData 
(fullname, birthday, seriesNumber, passportNumber, organId, date, taxpayerNumber) 
VALUES(@fullname, @birthday, @seriesNumber, @passportNumber, @organId, @date, @taxpayerNumber) 
SELECT SCOPE_IDENTITY() AS id`;
const createManagerQuery = `INSERT INTO ProgramEngineering.dbo.Staff (isActive, passportData, roleId, email, password) 
VALUES (1, @passportData, 1, @email, @password)`;
const getAuthActionLogs = `SELECT A.registratorId, B.passportData, C.fullname, D.actionName, A.date FROM ProgramEngineering.dbo.Actions A
INNER JOIN ProgramEngineering.dbo.Staff B ON A.registratorId = B.id
INNER JOIN ProgramEngineering.dbo.PassportData C ON B.passportData = C.id 
INNER JOIN ProgramEngineering.dbo.ActionTypes D ON A.actionTypeId = D.id
WHERE A.apostilleIdBefore IS NULL AND A.apostilleIdAfter IS NULL ORDER BY A.date DESC`;
const getRecordsActionLogs = `SELECT A.registratorId, B.passportData, C.fullname, D.actionName, A.date, 
A.apostilleIdBefore AS apostilleId, E.date AS apostilleDate FROM ProgramEngineering.dbo.Actions A
INNER JOIN ProgramEngineering.dbo.Staff B ON A.registratorId = B.id
INNER JOIN ProgramEngineering.dbo.PassportData C ON B.passportData = C.id
INNER JOIN ProgramEngineering.dbo.ActionTypes D ON A.actionTypeId = D.id
INNER JOIN ProgramEngineering.dbo.Apostilles E ON E.id = A.apostilleIdBefore 
--INNER JOIN ProgramEngineering.dbo.Apostilles F ON F.id = A.apostilleIdAfter
WHERE A.apostilleIdBefore IS NOT NULL AND A.apostilleIdAfter IS NOT NULL ORDER BY A.date DESC`;

const getPositionIdByName = 'SELECT id FROM ProgramEngineering.dbo.Positions WHERE positionName LIKE @positionName';
const getInsitutionIdByName = 'SELECT id FROM ProgramEngineering.dbo.Institutions WHERE institutionName LIKE @institutionName';

module.exports = {
    findApostilleQuery,
    checkApostilleQuery,
    getApostilleQuery,
    getShortApostilleQuery,
    userDataQuery,
    userDataUnprotectedQuery,
    getApostillesQuery,
    disableApostilleQuery,
    editSignerQuery,
    createSignerQuery,
    editSertifierQuery,
    createSertifierQuery,
    editApostilleQuery,
    createApostilleQuery,
    pushManagerAction,
    getManagersQuery,
    disableManagerQuery,
    enableManagerQuery,
    getManagerQuery,
    editPassportQuery,
    getShortManagerQuery,
    editManagerQuery,
    checkPassportQuery,
    checkManagerQuery,
    createPassportDataQuery,
    createManagerQuery,
    getAuthActionLogs,
    getRecordsActionLogs,
    getPositionIdByName,
    getInsitutionIdByName
}
