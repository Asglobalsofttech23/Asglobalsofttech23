const express = require('express');
const router = express.Router();
const moment = require('moment')

module.exports = (db) =>{

    router.get('/getAdmin',(req,res)=>{
        const getAdmin = `select * from staffs_master where dept_id = 1`;
        db.query(getAdmin,(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error.Admin Data could not be fetched"})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Admin Data not found"})
                }
              else{
                const convertImg = result.map((admin)=>({
                    ...admin,
                    staff_img : admin.staff_img.toString('base64')
                }))
                res.status(200).json(convertImg)
              }
            }
        })
    })


    router.get('/getClsTeacher',(req,res)=>{
        const getClsTeacher = `select staffs_master.*,class_advisor.* from staffs_master join class_advisor on staffs_master.staff_id = class_advisor.staff_id group by staffs_master.staff_id`;
        db.query(getClsTeacher,(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error.Class Teacher Data could not be fetched"})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Class Teacher Data not found"})
                }else{
                    const convertImg = result.map((clsTeacher)=>({
                        ...clsTeacher,
                        staff_img : clsTeacher.staff_img.toString('base64')
                    }))
                    res.status(200).json(convertImg)
                }
            } 
        })
    })

    router.get('/getSubjectTeacher',(req,res)=>{
        const getSubjectTeacher = `select staffs_master.*,staff_allocation.* from staffs_master join staff_allocation on staffs_master.staff_id = staff_allocation.staff_id`;
        db.query(getSubjectTeacher,(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error.Subject Teacher Data could not be fetched"})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Subject Teacher Data not found"}) 
                }else{
                    const convertImg = result.map((subjectTeacher)=>({
                        ...subjectTeacher,
                        staff_img : subjectTeacher.staff_img.toString('base64')
                    }))
                    res.status(200).json(convertImg)
                }
            }
        })
    })

    return router;
}