const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'public')));

// 檢查資料庫連線和連接SQLite數據庫
const db = new sqlite3.Database(path.join(__dirname, 'db', 'sqlite.db'), (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

// 定義API端點，顯示2022及2023各月份的白雞肉價格
app.get('/api/chicken-prices', (req, res) => {
    const startYear = parseInt(req.query.startYear);
    const startMonth = parseInt(req.query.startMonth);
    const endYear = parseInt(req.query.endYear);
    const endMonth = parseInt(req.query.endMonth);

    const sql = `
        SELECT year, month, price
        FROM ChickenPrice
        WHERE (year > ? OR (year = ? AND month >= ?))
          AND (year < ? OR (year = ? AND month <= ?))
        ORDER BY year, month
    `;
    const params = [startYear, startYear, startMonth, endYear, endYear, endMonth];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json(rows);
    });
});

module.exports = app;
