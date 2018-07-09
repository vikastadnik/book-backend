const app = require('express')();

const mysql = require("./db"),
    https = require('https'),
    auth = require('../models/Author'),
    mysqlPool = mysql.createPool();

const ITEMS_PER_PAGE = 5;

const authors = function () {

};
authors.prototype.getAll = function (req, res, callback) {

    const page  =  req.query['page'] ?  req.query['page']:  1;
    const currentOffset = (page-1)*ITEMS_PER_PAGE;
    var query;
    if ( page == -1){
         query = "SELECT * FROM AUTHORS ORDER BY ID DESC";
    } else{
       query = "SELECT * FROM AUTHORS ORDER BY ID DESC LIMIT "+currentOffset+","+ITEMS_PER_PAGE;
    }

    return new Promise(function (resolve, reject) {
        mysqlPool.query(query, function (err, rows) {
            if (err) {
                reject(err);
            } else {
                var authors1 = [];
                rows.forEach(function (p1, p2, p3) {
                    var author = new auth(p1);
                    authors1.push(author);
                });

                const queryPages = "SELECT COUNT(*) as count_pages FROM AUTHORS";
                mysqlPool.query(queryPages, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        var pagesCount  = Math.ceil(rows[0].count_pages/ITEMS_PER_PAGE);
                        resolve({authors: authors1, pagesCount: pagesCount});
                    }
                });

            }
        })
    });
};

authors.prototype.create = function (req, res, callback) {
    return new Promise(function (resolve, reject) {
        const query = "INSERT INTO `AUTHORS` (`NAME`, `BIRTH_DATE`) VALUES ?";
        const name = req.body.name;
        const birthDate = req.body.birthDate;

        const newAuthor = [[
            name,
            birthDate
        ]];

        mysqlPool.query(query, [newAuthor], function (err, rows) {
            if (err) {
                reject(err);
            } else {
                const query = "SELECT * FROM `AUTHORS` order by `ID` desc limit 1";
                mysqlPool.query(query, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(new auth(rows[0]));
                    }
                });
            }
        });
    })
};

authors.prototype.delete = function (req) {
    return new Promise(function (resolve, reject) {
        var idToDelete = req.query['id'];
        if ( idToDelete.length ===0){
            resolve();
        } else{
            const query = "DELETE FROM `AUTHORS` WHERE ID IN (" + idToDelete + ");";
            mysqlPool.query(query, idToDelete, function (err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        }


    });
};

module.exports = new authors();