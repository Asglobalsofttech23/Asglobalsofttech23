const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (db) =>{

    router.get('/getRoleByDepartment/:dept_id',(req,res)=>{
        const dept_id = req.params.dept_id
        const getRole = 'select * from role where dept_id = ?';
        db.query(getRole,dept_id,(error, result) => {
            if (error) {
                res.status(500).json({ message: 'Internal Server Error. Data could not be fetched.' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Role Data Not Found.' });
                } else {
                    res.status(200).json(result);
                }
            }
        });
    });
    return router;
}