var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// 在 express.js 中，使用 sqlite3 來操作數據庫，並開啟位置在 db/sqlite.db 的資料庫，需要確認是否成功打開資料庫
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the database.');
});

// 創建 drinks 表格
db.run('CREATE TABLE IF NOT EXISTS FruitPrices (id,date,name,price)');
// 撰寫 /api/FruitPrices 路由，使用 SQL 來查詢 drinks 所有的資料，回傳 json 格式的資料就好
app.get('/api/FruitPrices', (req, res) => {
    db.all('SELECT * FROM FruitPrices', (err, rows) => {
        if (err) {
            res.send('查詢失敗');
            return console.error(err.message);
        }
        res.json(rows);
    });
});

// 撰寫 /api/FruitPrices 路由，使用 SQLite 來查詢FruitPrices所有資料，回傳 json 格式的資料就好
app.get('/api/FruitPrices', (req, res) => {
    db.all('SELECT * FROM FruitPrices', (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return ;
        }
        res.json(rows);
    });
});

// 撰寫 post /api/insert 路由，使用 SQLite 新增一筆水果資料(id,date,name,price)，FruitPrics中，回傳文字的訊息，不要 json
app.post('/api/insert', (req, res) => {
    const { id, date, name, price } = req.body;
    db.run('INSERT INTO FruitPrices (id,date,name,price) VALUES (?,?,?,?)', [id, date, name, price], (err) => {
        if (err) {
            res.send('新增失敗');
            return console.error(err.message);
        }
        res.send('新增成功');
    });
});


module.exports = app;
