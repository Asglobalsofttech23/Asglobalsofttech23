const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) =>{
    router.get('/getClass',(req,res)=>{
        const getClass = 'select * from class';
        db.query(getClass, (error, result) => {
            if (error) {
                console.error('Error executing SQL query:', error);
                res.status(500).json({ message: 'Internal Server Error. Data could not be fetched.' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Class Data Not Found.' });
                } else {
                    res.status(200).json(result);
                }
            }
        });
    });

    router.get('/getSection',(req,res)=>{
        const getSection = 'select * from sections';
        db.query(getSection, (error, result) => {
            if (error) {
                console.error('Error executing SQL query:', error);
                res.status(500).json({ message: 'Internal Server Error. Data could not be fetched.' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Section Data Not Found.' });
                } else {
                    res.status(200).json(result);
                }
            }
        });
    });

 
    router.get('/getClsAndSecByIdForStuAll', (req, res) => {
        const { cls_id, sec_id } = req.query;
        const getQuery = `SELECT cls.cls_id, cls.cls_name, sec.sec_id, sec.sec_name FROM class cls JOIN sections sec ON cls.cls_id=? AND sec.sec_id=?`;
        db.query(getQuery, [cls_id, sec_id], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Internal server error. Data could not be fetched" });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: "Data Not Found" });
                } else {
                    res.status(200).json(result);
                }
            }
        });
    });
    


    return router
}