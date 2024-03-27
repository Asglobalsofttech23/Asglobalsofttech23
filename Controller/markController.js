const express = require('express')
const router = express.Router();
const moment = require('moment');

module.exports = (db) => {

    router.get('/getAllocationDataForMark', (req, res) => {
        const { staffId, clsId, secId } = req.query;
        
        // Call the stored procedure with the provided parameters
        const query = `CALL GetDetailsByStaffIdClsIdSecIdForMark(?, ?, ?)`;
        
        db.query(query, [staffId, clsId || null, secId || null], (err, results) => {
          if (err) {
            console.error('Error fetching details:', err);
            res.status(500).json({ message: 'Internal Server Error' });
          } else {
            res.status(200).json(results[0]); // Assuming results are returned in the first element of the array
          }
        });
      });
      

      router.get('/getExamMaster',(req,res)=>{
        const getQuery = `select * from exams_master`
        db.query(getQuery,(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error. Data could not be fetched."})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Data Not Found"})
                }else{
                    res.status(200).json(result)
                }
            }
        })
      })

      router.get('/getSubExam',(req,res)=>{
        const exam_id = req.query.exam_id;
        const getQuery = `select * from sub_exams where exam_id =?`
        db.query(getQuery,[exam_id],(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error. Data could not be fetched."})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Data Not Found"})
                }else{
                    res.status(200).json(result)
                }
            }
        })
      })


      router.get('/getStudentRollNoForMark',(req,res)=>{
        const {cls_id,sec_id,academic_year} = req.query;
        const getQuery = 'select * from students_allocation where cls_id=? and sec_id =? and academic_year=?'
        db.query(getQuery,[cls_id,sec_id,academic_year],(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal Server Error.Data could not be fetched"})
            }else{
                if(result.length === 0){
                    res.status(404).json({message:"Data Not found"})
                }else{
                    res.status(200).json(result)
                }
            }
        })
      })


      router.post('/postMark',(req,res)=>{
        const {staff_id,stu_allocation_id,exam_id,sub_exam_id,sub_allocation_id,mark,academic_year} = req.body;
        if(!staff_id || !stu_allocation_id || !exam_id || !sub_allocation_id || !mark || !academic_year){
            // console.error("Validation Error. Required fields are missing.");
            res.status(400).json({message:'Validation Error. Required fields are missing.'})
        }
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')
        

        if(exam_id === 1 || exam_id === 2 || exam_id === 3){
            const insertSubExamMark = `insert into sub_exam_mark(staff_id,stu_allocation_id,sub_exam_id,sub_allocation_id,sub_exam_mark,academic_year,created_at) values(?,?,?,?,?,?,?)`;
            db.query(insertSubExamMark,[staff_id,stu_allocation_id,sub_exam_id,sub_allocation_id,mark,academic_year,currentDate],(err,result)=>{
                if(err){
                    res.status(500).json({ message: 'Internal Server Error. Failed to insert sub exam mark.' });
                }else{
                    res.status(200).json({ message: 'Sub exam mark inserted successfully.' });
                }
            })
        }else{
            const insertExamMasterMark = `insert into exam_master_mark(staff_id,stu_allocation_id,exam_id,sub_allocation_id,mark,academic_year,created_at) values(?,?,?,?,?,?,?)`;
            db.query(insertExamMasterMark, [staff_id, stu_allocation_id, exam_id, sub_allocation_id, mark, academic_year, currentDate], (err, result) => {
                if (err) {
                    res.status(500).json({ message: 'Internal Server Error. Failed to insert exam master mark.' });
                } else {
                    res.status(200).json({ message: 'Exam master mark inserted successfully.' });
                }
            });
        }
      })

      router.get('/getExamMasterMarkBYSubAllAndStaffId', (req, res) => {
        const { staff_id, sub_allocation_id, exam_id, academic_year } = req.query;
    
        const getQuery = `
            SELECT ex_mas_mark.*, stu_all.roll_no, stu_mas.stu_name, ex_mas.exam_name, sub_all.cls_id, sub_all.sec_id, sub_all.sub_id, cls.cls_name, sec.sec_name, sub.sub_name 
            FROM exam_master_mark ex_mas_mark
            JOIN exams_master ex_mas ON ex_mas_mark.exam_id = ex_mas.exam_id 
            JOIN students_allocation stu_all ON ex_mas_mark.stu_allocation_id = stu_all.stu_allocation_id
            JOIN students_master stu_mas ON stu_all.stu_id = stu_mas.stu_id
            JOIN subject_allocation sub_all ON ex_mas_mark.sub_allocation_id = sub_all.sub_allocation_id
            JOIN class cls ON sub_all.cls_id = cls.cls_id
            JOIN sections sec ON sub_all.sec_id = sec.sec_id
            JOIN subjects sub ON sub_all.sub_id = sub.sub_id
            WHERE ex_mas_mark.staff_id = ? AND ex_mas_mark.sub_allocation_id = ? AND ex_mas_mark.exam_id = ? AND ex_mas_mark.academic_year = ?`;
    
        db.query(getQuery, [staff_id, sub_allocation_id, exam_id, academic_year], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error. Data could not be fetched" });
            } else {
                if(result.length === 0){
                    res.status(404).json({message:"Exam Master Mark Data Not found"})
                }else{
                    res.status(200).json(result);
                }
               
            }
        });
    });
    

    router.put('/updateExamMasterMark/:mark_id', (req, res) => {
        const mark_id = req.params.mark_id;
        const { staff_id, stu_allocation_id, exam_id, sub_exam_id, sub_allocation_id, mark, academic_year } = req.body;
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
        const updateQuery = `UPDATE exam_master_mark SET staff_id=?, stu_allocation_id=?, exam_id=?, sub_allocation_id=?, mark=?, academic_year=?, updated_at=? WHERE mark_id=?`;
    
        if (exam_id === 1 || exam_id === 2 || exam_id === 3) {
            const deleteDataQuery = `DELETE FROM exam_master_mark WHERE mark_id=?`;
            const insertQuery = `INSERT INTO sub_exam_mark (staff_id, stu_allocation_id, sub_exam_id, sub_allocation_id, sub_exam_mark, academic_year, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
            db.query(deleteDataQuery, [mark_id], (dltErr, dltResult) => {
                if (dltErr) {
                    res.status(500).json({ message: "Internal Server Error. Data could not be deleted." });
                } else {
                    db.query(insertQuery, [staff_id, stu_allocation_id, sub_exam_id, sub_allocation_id, mark, academic_year, currentDate], (insertErr, insertRes) => {
                        if (insertErr) {
                            res.status(500).json({ message: "Internal Server Error. Data could not be inserted." });
                        } else {
                            res.status(200).json({ message: "Data inserted successfully." });
                        }
                    });
                }
            });
        } else {
            db.query(updateQuery, [staff_id, stu_allocation_id, exam_id, sub_allocation_id, mark, academic_year, currentDate, mark_id], (updateErr, updateRes) => {
                if (updateErr) {
                    res.status(500).json({ message: "Internal Server Error. Data could not be updated." });
                } else {
                    res.status(200).json({ message: "Data updated successfully." });
                }
            });
        }
    });


    router.delete('/deleteExamMasterMark/:mark_id',(req,res)=>{
        const mark_id = req.params.mark_id;
        const dltData = `DELETE FROM exam_master_mark WHERE mark_id=?`;
        db.query(dltData,[mark_id],(err,result)=>{
            if(err){
                res.status(500).json({message:"Internal server error.Data could not be deleted"})
            }else{
                res.status(200).json({message:"Data Deleted Successfully."})
            }
        })
    })
    
    
    router.get('/getSubExamMarkByStaffIdAndSubAll', (req, res) => {
        const { staff_id, sub_allocation_id, sub_exam_id, academic_year } = req.query;
    
        const getQuery = `
        select sub_ex_mark.*,stu_all.roll_no,stu_mas.stu_name,ex_mas.exam_id,ex_mas.exam_name,sub_ex.sub_exam_id,sub_ex.sub_exam_name,sub_all.cls_id,sub_all.sec_id,sub_all.sub_id,cls.cls_name,sec.sec_name,sub.sub_name from sub_exam_mark sub_ex_mark
        join sub_exams sub_ex on sub_ex_mark.sub_exam_id = sub_ex.sub_exam_id
        join exams_master ex_mas on sub_ex.exam_id = ex_mas.exam_id 
        join students_allocation stu_all on sub_ex_mark.stu_allocation_id = stu_all.stu_allocation_id
        join students_master stu_mas on stu_all.stu_id = stu_mas.stu_id
        join subject_allocation sub_all on sub_ex_mark.sub_allocation_id = sub_all.sub_allocation_id
        join class cls on sub_all.cls_id = cls.cls_id
        join sections sec on sub_all.sec_id = sec.sec_id
        join subjects sub on sub_all.sub_id = sub.sub_id
        where sub_ex_mark.staff_id = ? and sub_ex_mark.sub_allocation_id = ? and sub_ex_mark.sub_exam_id = ? and sub_ex_mark.academic_year = ?`;
    
        db.query(getQuery, [staff_id, sub_allocation_id, sub_exam_id, academic_year], (err, result) => {
            if (err) {
                res.status(500).json({ message: "Internal Server Error. Data could not be fetched" });
            } else {
                if(result.length === 0){
                    res.status(404).json({message:"Sub Exam Mark Data Not found"})
                }else{
                    res.status(200).json(result);
                }
               
            }
        });
    });


    router.put('/UpdateSubExamMark/:sub_exam_mark_id', (req, res) => {
        const sub_exam_mark_id = req.params.sub_exam_mark_id;
        const { staff_id, stu_allocation_id, exam_id, sub_exam_id, sub_allocation_id, sub_exam_mark, academic_year } = req.body;
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    
        if (exam_id === 4 || exam_id === 5 || exam_id === 6) {
            const dltQuery = `DELETE FROM sub_exam_mark WHERE sub_exam_mark_id=?`;
            const insertQuery = `INSERT INTO exam_master_mark (staff_id, stu_allocation_id, exam_id, sub_allocation_id, mark, academic_year, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
            db.query(dltQuery, [sub_exam_mark_id], (dltErr, dltRes) => {
                if (dltErr) {
                    res.status(500).json({ message: 'Internal Server Error. Data could not be deleted.' });
                } else {
                    db.query(insertQuery, [staff_id, stu_allocation_id, exam_id, sub_allocation_id, sub_exam_mark, academic_year, currentDate], (insertErr, insertRes) => {
                        if (insertErr) {
                            res.status(500).json({ message: 'Internal Server Error. Data could not be stored.' });
                        } else {
                            res.status(200).json({ message: 'Data Stored Successfully.' });
                        }
                    });
                }
            });
        } else {
            const updateQuery = `UPDATE sub_exam_mark SET staff_id=?, stu_allocation_id=?, sub_exam_id=?, sub_allocation_id=?, sub_exam_mark=?, academic_year=?, updated_at=? WHERE sub_exam_mark_id=?`;
            
            db.query(updateQuery, [staff_id, stu_allocation_id, sub_exam_id, sub_allocation_id, sub_exam_mark, academic_year, currentDate, sub_exam_mark_id], (updateErr, updateRes) => {
                if (updateErr) {
                    res.status(500).json({ message: 'Internal Server Error. Data could not be updated.' });
                } else {
                    res.status(200).json({ message: 'Data Updated Successfully.' });
                }
            });
        }
    });

    router.delete('/dltSubExamMark/:sub_exam_mark_id', (req, res) => {
        const sub_exam_mark_id = req.params.sub_exam_mark_id;
    

        if (!sub_exam_mark_id || isNaN(sub_exam_mark_id)) {
            return res.status(400).json({ error: "Invalid sub_exam_mark_id provided." });
        }
    
        const dltQuery = `DELETE FROM sub_exam_mark WHERE sub_exam_mark_id = ?`;
    
        db.query(dltQuery, [sub_exam_mark_id], (err, result) => {
            if (err) {

                return res.status(500).json({ error: "An error occurred while deleting sub exam mark." });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Sub exam mark not found." });
            }
            res.status(200).json({ message: "Sub exam mark deleted successfully." });
        });
    });
    
    
    
    return router;
}




