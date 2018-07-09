const app = require('express')();

const mysql = require("./db"),
    https = require('https'),
    book = require('../models/Book'),
    mysqlPool = mysql.createPool();

const ITEMS_PER_PAGE = 5;

const books = function () {

};
books.prototype.getAll = function (req, res, callback) {

    const page  =  req.query['page'] ?  req.query['page'] :  1;
    const currentOffset = (page-1)*ITEMS_PER_PAGE;

    const query = "SELECT b.*, a.NAME  FROM BOOKS b JOIN AUTHORS a ON a.ID = b.AUTHOR_ID  ORDER BY ID DESC LIMIT "+currentOffset+","+ITEMS_PER_PAGE;
    return new Promise(function (resolve, reject) {
        mysqlPool.query(query, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                var booksArray = [];

                rows.forEach(function (p1, p2, p3) {
                    console.log(p1);
                    booksArray.push(new book(p1));
                });

                console.log(booksArray);
                const queryPages = "SELECT COUNT(*) as count_pages FROM BOOKS";
                mysqlPool.query(queryPages, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(rows[0].count_pages);
                        var pagesCount  = Math.ceil(rows[0].count_pages/ITEMS_PER_PAGE);
                        resolve({books: booksArray, pagesCount: pagesCount});
                    }
                });

            }
        })
    });
};

books.prototype.create = function (req, res, callback) {
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO `BOOKS` (`TITLE`, `RELEASE_DATE`, `AUTHOR_ID`) VALUES ?";
        const title = req.body.title;
        const releaseDate = req.body.releaseDate;
        const authorID = req.body.authorID;

        const newBook = [[
            title,
            releaseDate,
            authorID
        ]];

        mysqlPool.query(query, [newBook], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                const query = "SELECT b.*, a.NAME FROM BOOKS b JOIN AUTHORS a ON a.ID = b.AUTHOR_ID order by `ID` desc limit 1";
                mysqlPool.query(query, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new book(rows[0]));
                    }
                });
            }
        });
    })
};

books.prototype.delete = function (req) {
    return new Promise(function (resolve, reject) {
        var idToDelete = req.query['id'];

        if ( idToDelete.length ===0){
            resolve();
        } else{
            const query = "DELETE FROM `BOOKS` WHERE ID IN (" + idToDelete + ");";
            mysqlPool.query(query, idToDelete, function (err, rows) {
                if (err) {
                    reject(err);
                } else {

                }
            });
        }


    });
};

module.exports = new books();