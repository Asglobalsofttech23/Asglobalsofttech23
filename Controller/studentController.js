const express = require("express");
const router = express.Router();
const moment = require("moment");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
module.exports = (db) => {
  router.post("/PostStudent", upload.single("stu_img"), (req, res) => {
    const {
      staff_id,
      cls_id,
      stu_name,
      mobile,
      email,
      dob,
      gender,
      blood_group,
      aadhar,
      address,
    } = req.body;
    const stu_img = req.file.buffer;
    if (
      !staff_id ||
      !cls_id ||
      !stu_name ||
      !mobile ||
      !email ||
      !dob ||
      !gender ||
      !blood_group ||
      !aadhar ||
      !address ||
      !stu_img
    ) {
      console.error("Validation Error. Required fields are missing.");
      return res
        .status(400)
        .json({ message: "Validation Error. Required fields are missing." });
    }

    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

    const insertData =
      "INSERT INTO students_master (staff_id,cls_id,stu_name,mobile,email,dob,gender,blood_group,aadhar,stu_img,address,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    db.query(
      insertData,
      [
        staff_id,
        cls_id,
        stu_name,
        mobile,
        email,
        dob,
        gender,
        blood_group,
        aadhar,
        stu_img,
        address,
        currentDate,
      ],
      (error, result) => {
        if (error) {
          console.error("Internal Server Error. Data could not be Added");
          res.status(500).json({
            message: "Internal Server Error. Data could not be Added",
          });
        } else {
          res.status(200).json({ message: "Data Added Successfully" });
        }
      }
    );
  });

  router.get("/getStudents", (req, res) => {
    const getData = `
    select stu.*,staff.staff_name,cls.cls_name from students_master stu 
    join staffs_master staff on stu.staff_id = staff.staff_id join class cls on stu.cls_id = cls.cls_id`;
    db.query(getData, (err, result) => {
      if (err) {
        res.status(500).json({
          message: "Internal Server Error. Data could not be fetched.",
        });
      } else {
        if (result.length === 0) {
          res.status(404).json({ message: "Students Data Not Found." });
        } else {
          const convertData = result.map((data) => ({
            ...data,
            stu_img: data.stu_img.toString("base64"),
            dob: moment(data.dob).format("YYYY-MM-DD"),
          }));
          res.status(200).json(convertData);
        }
      }
    });
  });

  router.put("/update/:stu_id", upload.single("stu_img"), (req, res) => {
    
      const stu_id = req.params.stu_id;
      const {
      staff_id,
      cls_id,
      stu_name,
      mobile,
      email,
      dob,
      gender,
      blood_group,
      aadhar,
      address,
      } = req.body;
      const stu_img = req.file ? req.file.buffer : null;
      const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
  
      if (
      !staff_id ||
      !cls_id ||
      !stu_name ||
      !mobile ||
      !email ||
      !dob ||
      !gender ||
      !blood_group ||
      !aadhar ||
      !address 
      ) {
        console.error("Validation Error. Required fields are missing.");
        return res
          .status(400)
          .json({ message: "Validation Error. Required fields are missing." });
      }
  
      let updateData;
      let queryParams;
  
      if (stu_img) {
        updateData = `
          UPDATE students_master 
          SET staff_id=?,cls_id=?,stu_name=?,mobile=?,email=?,dob=?,gender=?,blood_group=?,aadhar=?,
          stu_img=?,address=?,updated_at=? where stu_id=?`;
        queryParams = [
          staff_id,
          cls_id,
          stu_name,
          mobile,
          email,
          dob,
          gender,
          blood_group,
          aadhar,
          stu_img,
          address,
          currentDate,
          stu_id,
        ];
      } else {
        updateData = `
        UPDATE students_master 
        SET staff_id=?,cls_id=?,stu_name=?,mobile=?,email=?,dob=?,gender=?,blood_group=?,aadhar=?,
        address=?,updated_at=? where stu_id=?`;
        queryParams = [
          staff_id,
          cls_id,
          stu_name,
          mobile,
          email,
          dob,
          gender,
          blood_group,
          aadhar,
          address,
          currentDate,
          stu_id,
        ];
      }
  
      db.query(updateData, queryParams, (err, result) => {
        if (err) {
          console.error("Internal Server Error. Data could not be Updated.", err);
          res
            .status(500)
            .json({
              message: "Internal Server Error. Data could not be Updated.",
            });
        } else {
          res.status(200).json({ result: "Data was Updated Successfully" });
        }
      });
    });

  router.delete('/delete/:stu_id',(req,res)=>{
    const stu_id = req.params.stu_id;
    const dltData = 'delete from students_master where stu_id=?';
    db.query(dltData,[stu_id],(err,result) =>{
      if(err){
        res.status(500).json({message:"Internal server error. Data could not be deleted."})
      }else{
        if(result.affectedRows > 0){
          res.status(200).json({ message: "Data deleted successfully." });
        }else{
          res.status(404).json({ message: "Data not found or could not be deleted." });
        }
      }
    })
  })

  router.get('/getStudentByClass',(req,res)=>{
    const cls_id = req.query.cls_id;
    const getQuery = `select * from students_master where is_Allocated = 0 and cls_id = ?`
    db.query(getQuery,cls_id,(err,result)=>{
      if(err){
        res.status(500).json({message:"Internal Server Error.Students Data could not be fetched"})
      }else{
        if(result.length === 0){
          res.status(404).json({message:"Students Data Not Found"})
        }else{
          res.status(200).json(result)
        }
      }
    })
  })

  router.post('/postStudentAllocationData', (req, res) => {
    const { staff_id, stu_id, cls_id, sec_id, roll_no, academic_year } = req.body;
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    
    if (!staff_id || !stu_id || !cls_id || !sec_id || !roll_no || !academic_year) {
        return res.status(400).json({ message: "All fields are required." });
    }

    if (!moment(academic_year, 'YYYY-YYYY').isValid()) {
        return res.status(400).json({ message: "Invalid academic year format. Please use YYYY-YYYY format." });
    }

    const postQuery = `INSERT INTO students_allocation (staff_id, stu_id, cls_id, sec_id, roll_no, academic_year, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(postQuery, [staff_id, stu_id, cls_id, sec_id, roll_no, academic_year, currentDate], (err, result) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ message: "Internal Server Error. Data could not be stored." });
        } else {
            res.status(200).json({ message: "Data stored successfully." });
        }
    });
});


router.get('/getStudentAllocationData',(req,res)=>{
  const getQuery = `
  select stu_all.stu_allocation_id,staff.staff_id,staff.staff_name,stu.stu_id,stu.stu_name,cls.cls_id,cls.cls_name,sec.sec_id,sec.sec_name,stu_all.roll_no,stu_all.academic_year from students_allocation stu_all 
join staffs_master staff on staff.staff_id = stu_all.staff_id 
join students_master stu on stu.stu_id = stu_all.stu_id
join class cls on cls.cls_id = stu_all.cls_id
join sections sec on sec.sec_id = stu_all.sec_id`;
    db.query(getQuery,(err,result)=>{
      if(err){
        res.status(500).json({message:"Internal Server Error.Data could not be fetched"})
      }else{
        if(result.length === 0){
          res.status(404).json({message:"Data Not Found"})
        }else{
          res.status(200).json(result)
        }
      }
    })

})


router.put('/updateStuAllocation/:stu_allocation_id', (req, res) => {
  const stu_allocation_id = req.params.stu_allocation_id;
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const { staff_id, stu_id, cls_id, sec_id, roll_no, academic_year } = req.body;
  
  const updateQuery = `UPDATE students_allocation 
                       SET staff_id=?, stu_id=?, cls_id=?, sec_id=?, roll_no=?, academic_year=?, updated_at=? 
                       WHERE stu_allocation_id=?`;

  db.query(updateQuery, [staff_id, stu_id, cls_id, sec_id, roll_no, academic_year, currentDate, stu_allocation_id], (err, result) => {
    if (err) {
      console.error("Error updating data:", err);
      res.status(500).json({ message: "Internal Server Error. Data could not be updated." });
    } else {
      console.log("Data Updated Successfully.");
      res.status(200).json({ message: "Data Updated Successfully." });
    }
  });
});

router.delete('/dltAllocation/:stu_allocation_id', (req, res) => {
  const stu_allocation_id = req.params.stu_allocation_id;
  const dltQuery = `DELETE FROM students_allocation WHERE stu_allocation_id=?`;

  db.query(dltQuery, [stu_allocation_id], (err, result) => {
    if (err) {
      res.status(500).json({ message: 'Internal server error. Data could not be deleted' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Data Not found' });
      } else {
        res.status(200).json({ message: "Data Deleted Successfully." });
      }
    }
  });
});



  return router;
};
