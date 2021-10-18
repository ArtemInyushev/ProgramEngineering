const findApostilleQuery = `SELECT A.id, A.country, A.date, A.city, A.number, A.active, B.fullname AS signerName, B.position AS signerPosition, B.institution AS signerInst, C.fullname AS sertName, C.position AS sertPosition, C.institution AS sertInst, C.signType FROM Register.dbo.Apostille A 
FULL OUTER JOIN Register.dbo.Signers B ON A.signer = B.id
FULL OUTER JOIN Register.dbo.Sertifiers C ON A.sertifier = C.id
WHERE A.number = @number AND A.date LIKE @date`;
const checkApostilleQuery = `SELECT A.id, A.country, A.date, A.city, A.number, A.active, B.fullname AS signerName, B.position AS signerPosition, B.institution AS signerInst, C.fullname AS sertName, C.position AS sertPosition, C.institution AS sertInst, C.signType FROM Register.dbo.Apostille A 
FULL OUTER JOIN Register.dbo.Signers B ON A.signer = B.id
FULL OUTER JOIN Register.dbo.Sertifiers C ON A.sertifier = C.id
WHERE A.number = @number`;
const getApostilleQuery = `SELECT A.id, A.country, A.date, A.city, A.number, A.active, B.fullname AS signerName, B.position AS signerPosition, B.institution AS signerInst, C.fullname AS sertName, C.position AS sertPosition, C.institution AS sertInst, C.signType FROM Register.dbo.Apostille A
FULL OUTER JOIN Register.dbo.Signers B ON A.signer = B.id
FULL OUTER JOIN Register.dbo.Sertifiers C ON A.sertifier = C.id
WHERE A.id = @id`;
const getShortApostilleQuery = 'SELECT * FROM Register.dbo.Apostille WHERE id = @id';
const userDataQuery = `SELECT * FROM Register.dbo.Staff A
FULL OUTER JOIN Register.dbo.Passport B ON A.passport = B.id
WHERE email LIKE @email AND password LIKE @password`;
const userDataUnprotectedQuery = `SELECT * FROM Register.dbo.Staff A
FULL OUTER JOIN Register.dbo.Passport B ON A.passport = B.id
WHERE email LIKE @email`;
const getApostillesQuery = `SELECT * FROM Register.dbo.Apostille A
INNER JOIN Register.dbo.Signers B ON A.signer = B.id
INNER JOIN Register.dbo.Sertifiers C ON A.sertifier = C.id`;
const disableApostilleQuery = `UPDATE Register.dbo.Apostille SET active = 1 WHERE id = @id`;
const editSignerQuery = `UPDATE Register.dbo.Signers SET fullname = @fullname,
position = @position, institution = @inst WHERE id = @id`;
const createSignerQuery = `INSERT INTO Register.dbo.Signers (fullname, position, institution)
VALUES(@fullname, @position, @inst)
SELECT SCOPE_IDENTITY() AS id`;
const editSertifierQuery = `UPDATE Register.dbo.Sertifiers SET fullname = @fullname,
position = @position, institution = @inst, signType = @st WHERE id = @id`;
const createSertifierQuery = `INSERT INTO Register.dbo.Sertifiers (fullname, position, institution, signType)
VALUES(@fullname, @position, @inst, @st)
SELECT SCOPE_IDENTITY() AS id`
const editApostilleQuery = `UPDATE Register.dbo.Apostille SET country = @country, date = @date,
city = @city, number = @number WHERE id = @id`;
const createApostilleQuery = `INSERT INTO Register.dbo.Apostille (country, date, city, number, active, signer, sertifier)
VALUES (@country, @date, @city, @number, 0, @signer, @sertifier)
SELECT SCOPE_IDENTITY() AS id`;
const pushManagerAction = 'INSERT INTO Register.dbo.Actions (manager, record, date, type) VALUES (@manager, @record, GETDATE(), @type)';

const getManagersQuery = `SELECT * FROM Register.dbo.Staff A
INNER JOIN Register.dbo.Passport B ON A.passport = B.id
WHERE A.role = 1`;
const disableManagerQuery = `UPDATE Register.dbo.Staff SET active = 1 WHERE id = @id`;
const enableManagerQuery = "UPDATE Register.dbo.Staff SET active = 0 WHERE id = @id";
const getManagerQuery = `SELECT * FROM Register.dbo.Staff A
FULL OUTER JOIN Register.dbo.Passport B ON A.passport = B.id
WHERE A.id = @id AND role = 1`;
const editPassportQuery = `UPDATE Register.dbo.Passport SET fullname = @fullname,
agency = @agency, date = @date, birthdate = @birthdate, number = @number, taxNumber = @taxNumber, series = @series
WHERE id = @id`;
const getShortManagerQuery = "SELECT * FROM Register.dbo.Staff WHERE id = @id";
const editManagerQuery = `UPDATE Register.dbo.Staff SET email = @email, password = @password
WHERE id = @id`;
const checkPassportQuery = "SELECT * FROM Register.dbo.Passport WHERE number = @number OR taxNumber = @taxNumber";
const checkManagerQuery = "SELECT * FROM Register.dbo.Staff WHERE email LIKE @email";
const createPassportDataQuery = `INSERT INTO Register.dbo.Passport (fullname, agency, date, birthdate, number, series, taxNumber)
VALUES(@fullname, @agency, @date, @birthdate, @number, @series, @taxNumber)
SELECT SCOPE_IDENTITY() AS id`;
const createManagerQuery = `INSERT INTO Register.dbo.Staff (role, email, active, password, passport)
VALUES (1, @email, 1, @password, @id)`;
const getAuthActionLogs = `SELECT A.manager, B.passport, C.fullname, A.type, A.date FROM Register.dbo.Actions A
INNER JOIN Register.dbo.Staff B ON A.manager = B.id
INNER JOIN Register.dbo.Passport C ON B.passport = C.id
WHERE record IS NULL ORDER BY A.date DESC`;
const getRecordsActionLogs = `SELECT A.manager, B.passport, C.fullname, A.type, A.date, D.number, D.date AS apostilleDate FROM Register.dbo.Actions A
INNER JOIN Register.dbo.Staff B ON A.manager = B.id
INNER JOIN Register.dbo.Passport C ON B.passport = C.id
INNER JOIN Register.dbo.Apostille D ON D.id = A.record
WHERE record IS NOT NULL ORDER BY A.date DESC`;

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
    getRecordsActionLogs
}
