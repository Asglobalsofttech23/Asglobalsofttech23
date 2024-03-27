const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) =>{

    router.get('/getSubByClsAndSec/:cls_id?/:sec_id?', (req, res) => {
        const { cls_id, sec_id } = req.params;
    
        // Call the stored procedure
        db.query('CALL GetSubjectByClsAndSec(?, ?)', [cls_id || null, sec_id || null], (error, results, fields) => {
            if (error) {
                console.error('Error fetching data: ', error);
                res.status(500).send('Error fetching data');
                return;
            }
    
            // Send data to the client
            res.json(results[0]);
        });
    });
    
        
    

    return router
}