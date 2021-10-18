require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');

const app = express();

const authRouter = require('./routers/auth');
const managersRouter = require('./routers/managers');
const apostillesRouter = require('./routers/apostilles');

app.use(express.static('public'));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/managers', managersRouter);
app.use('/api/v1/apostilles', apostillesRouter);

app.listen(process.env.PORT, () => {
    console.log(`Connected to port: ${process.env.PORT}`)
})

app.get('*/images/:filename', function(req,res) {
    let name = req.params.filename;
    res.download(__dirname + '/public/images/' + name);
});

app.get('*/icons/:filename', function(req,res) {
    let name = req.params.filename;
    res.download(__dirname + '/public/icons/' + name);
});