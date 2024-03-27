const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) =>{

    router.get('/getDepartment',(req,res)=>{
        const detDept = 'select * from department';
        db.query(detDept, (error, result) => {
            if (error) {
                res.status(500).json({ message: 'Internal Server Error. Data could not be fetched.' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Department Data Not Found.' });
                } else {
                    res.status(200).json(result);
                }
            }
        });
    });
    return router;
}