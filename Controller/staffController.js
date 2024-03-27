const express = require("express");
const router = express.Router();
const moment = require("moment");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = (db) => {
  router.post("/postStaff", upload.single("staff_img"), (req, res) => {
    const {
      dept_id,
      role_id,
      staff_name,
      email,
      mobile,
      gender,
      qualification,
      experience,
      address,
    } = req.body;
    const staff_img = req.file.buffer;
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    if (
      !dept_id ||
      !role_id ||
      !staff_name ||
      !email ||
      !mobile ||
      !gender ||
      !qualification ||
      !experience ||
      !address ||
      !staff_img
    ) {
      res
        .status(400)
        .json({ message: "Validation Error. Required fields are missing." });
    } else {
      const insertData =
        "insert into staffs_master(dept_id ,role_id ,staff_name,email ,mobile ,gender ,qualification, experience,address,staff_img,created_at) values(?,?,?,?,?,?,?,?,?,?,?) ";
      const paramsData = [
        dept_id,
        role_id,
        staff_name,
        email,
        mobile,
        gender,
        qualification,
        experience,
        address,
        staff_img,
        currentDate,
      ];
      db.query(insertData, paramsData, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({ message: "Internal Server Error.Data could not be Added" });
            console.log("Error :",err)
        } else {
          res.status(200).json({ message: "Data Added Successfully" });
        }
      });
    }
  });

  router.get("/getStaff", (req, res) => {
    const getData = `
    select staff.* , dept.dept_name,role.role_name from staffs_master staff
    inner join department dept on staff.dept_id = dept.dept_id 
    inner join role on staff.role_id  = role.role_id where staff.isAlive = 1
                       `;
    db.query(getData, (err, result) => {
      if (err) {
        res
          .status(500)
          .json({
            message: "Internal Server Error.Staff Data Could Not Be Fetched",
          });
      } else {
        if (result.length === 0) {
          res.status(404).json({ message: "Staff Data Not Found" });
        } else {
          const convertImage = result.map((staff) => ({
            ...staff,
            staff_img: staff.staff_img.toString("base64"),
          }));
          res.status(200).json(convertImage);
        }
      }
    });
  });

  router.put("/update/:staff_id", upload.single("staff_img"), (req, res) => {
    const staff_id = req.params.staff_id;
    const {
      dept_id,
      role_id,
      staff_name,
      email,
      mobile,
      gender,
      qualification,
      experience,
      address,
    } = req.body;
    const staff_img = req.file ? req.file.buffer : null;
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
    if (
      !dept_id ||
      !role_id ||
      !staff_name ||
      !email ||
      !mobile ||
      !gender ||
      !qualification ||
      !experience ||
      !address
    ) {
      res
        .status(400)
        .json({ message: "Validation Error. Required fields are missing." });
    } else {
      let updateQuery;
      let paramsData;
      if (staff_img) {
        updateQuery = `
                        update staffs_master set dept_id=?,role_id=?,staff_name=?,email=?,mobile=?,gender=?,
                        qualification=?,experience=?,address=?,staff_img=?,updated_at=? where staff_id=?
                        `;
        paramsData = [
          dept_id,
          role_id,
          staff_name,
          email,
          mobile,
          gender,
          qualification,
          experience,
          address,
          staff_img,
          currentDate,
          staff_id,
        ];
      } else {
        updateQuery = `
                        update staffs_master set dept_id=?,role_id=?,staff_name=?,email=?,mobile=?,gender=?,
                        qualification=?,experience=?,address=?,updated_at=? where staff_id=?
                        `;
        paramsData = [
          dept_id,
          role_id,
          staff_name,
          email,
          mobile,
          gender,
          qualification,
          experience,
          address,
          currentDate,
          staff_id,
        ];
      }
      db.query(updateQuery, paramsData, (err, result) => {
        if (err) {
          res
            .status(500)
            .json({
              message: "Internal Server Error. Data could not be Updated.",
            });
        } else {
          res.status(200).json({ message: "Data was Updated Successfully" });
        }
      });
    }
  });

  router.delete('/delete/:staff_id',(req,res)=>{
    const staff_id = req.params.staff_id;
    const dltData = 'delete from staffs_master where staff_id = ?';
    db.query(dltData,staff_id,(err,result)=>{
      if(err){
        res.status(500).json({message:"Internal Server Error.Data could not be deleted"})
      }else{
        if(result.affectedRows > 0){
          res.status(200).json({message:"Data deleted successfully."})
        }else{
          res.status(404).json({ message: "Data not found or could not be deleted." });
        }
      }
    })
  })


  const moment = require('moment');

  router.post('/resign', (req, res) => {
    const { staff_id, reason } = req.body;
  
    // Validate request data
    if (!staff_id || !reason) {
      return res.status(400).json({ message: "Bad Request. Please provide both staff_id and reason." });
    }
  
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const updateDataQuery = 'UPDATE staffs_master SET isAlive = 0, deleted_at = ? WHERE staff_id = ?';
    const insertResignationQuery = 'INSERT INTO resigned_staff (staff_id, reason, deleted_at) VALUES (?, ?, ?)';
  
    db.query(updateDataQuery, [currentDate, staff_id], (updateErr, updateRes) => {
      if (updateErr) {
        console.error(updateErr);
        return res.status(500).json({ message: "Internal Server Error. Data could not be updated." });
      } else {
        db.query(insertResignationQuery, [staff_id, reason, currentDate], (postErr, postRes) => {
          if (postErr) {
            console.error(postErr);
            return res.status(500).json({ message: "Internal Server Error. Resignation data could not be added." });
          } else {
            res.status(200).json({ message: "Staff resigned successfully." });
          }
        });
      }
    });
  });


  router.post('/postStaffAllocation', (req, res) => {
    const {
        staff_id,
        cls_id,
        sec_id,
        sub_allocation_id,
        is_class_advisor,
        academic_year
    } = req.body;
    const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");

    // Query to insert staff allocation data
    const allocationDataQuery = `insert into staff_allocation (staff_id, sub_allocation_id,academic_year, created_at) values (?, ?, ?,?)`;
    
    db.query(allocationDataQuery, [staff_id, sub_allocation_id,academic_year, currentDate], (allocationErr, allocationRes) => {
        if (allocationErr) {
            
            return res.status(500).json({ message: "Internal Server Error. Staff allocation data could not be added." });
        }

        if (is_class_advisor === 'yes') {

            const advisorDataQuery = `insert into class_advisor (staff_id, cls_id, sec_id, academic_year, created_at) values (?, ?, ?, ?, ?)`;
            
            db.query(advisorDataQuery, [staff_id, cls_id, sec_id, academic_year, currentDate], (advisorErr, advisorRes) => {
                if (advisorErr) {
                    return res.status(500).json({ message: "Internal Server Error. Class advisor data could not be added." });
                }
                res.status(200).json({ message: "Staff allocation and class advisor data added successfully." });
            });
        } else {
            res.status(200).json({ message: "Staff allocation data added successfully." });
        }
    });
});


router.get('/getStaffAllocation',(req,res)=>{
  const getData = `
  SELECT 
    sta.staff_allocation_id, 
    sta.staff_id,
    staff.staff_name,
    cls.cls_id,
    cls.cls_name, 
    sec.sec_id,
    sec.sec_name,
    sa.sub_allocation_id,
    sub.sub_name,
    sta.academic_year
    
    
FROM 
    subject_allocation sa 
    JOIN class cls ON cls.cls_id = sa.cls_id 
    JOIN sections sec ON sec.sec_id = sa.sec_id 
    JOIN subjects sub ON sub.sub_id = sa.sub_id 
    JOIN staff_allocation sta ON sta.sub_allocation_id = sa.sub_allocation_id
    JOIN staffs_master staff ON staff.staff_id = sta.staff_id
GROUP BY 
    sta.staff_allocation_id, 
    sta.staff_id,
    staff.staff_name,
    cls.cls_id,
    cls.cls_name, 
    sec.sec_id,
    sec.sec_name,
    sa.sub_allocation_id,
    sub.sub_name`;
  db.query(getData,(err,result)=>{
    if(err){
      res.status(500).json({message:"Internal Server Error.Data could not be fetched"})
    }else{
      if(result.length === 0){
        res.status(404).json({message:"Staff Allocation Data not found"})
      }else{
        res.status(200).json(result)
      }
    }
  })

})


// Here old query but it is worked....
// router.get('/getStaffAllocation',(req,res)=>{
//   const getData = `
//   SELECT 
//     sta.staff_allocation_id, 
//     sta.staff_id,
//     staff.staff_name,
//     cls.cls_id,
//     cls.cls_name, 
//     sec.sec_id,
//     sec.sec_name,
//     sa.sub_allocation_id,
//     sub.sub_name, 
//     CASE WHEN cls_ad.cls_id IS NOT NULL THEN 'yes' ELSE 'no' END AS is_class_advisor,
//     IFNULL(cls_ad.cls_advisor_id, '') AS cls_advisor_id,
//     GROUP_CONCAT(DISTINCT cls_ad.academic_year ORDER BY cls_ad.academic_year) AS academic_year
// FROM 
//     subject_allocation sa 
//     JOIN class cls ON cls.cls_id = sa.cls_id 
//     JOIN sections sec ON sec.sec_id = sa.sec_id 
//     JOIN subjects sub ON sub.sub_id = sa.sub_id 
//     JOIN staff_allocation sta ON sta.sub_allocation_id = sa.sub_allocation_id
//     JOIN staffs_master staff ON staff.staff_id = sta.staff_id
//     LEFT JOIN class_advisor cls_ad ON sta.staff_id = cls_ad.staff_id AND cls.cls_id = cls_ad.cls_id
// GROUP BY 
//     sta.staff_allocation_id, 
//     sta.staff_id,
//     staff.staff_name,
//     cls.cls_id,
//     cls.cls_name, 
//     sec.sec_id,
//     sec.sec_name,
//     sa.sub_allocation_id,
//     sub.sub_name, 
//     is_class_advisor,
//     cls_advisor_id`;
//   db.query(getData,(err,result)=>{
//     if(err){
//       res.status(500).json({message:"Internal Server Error.Data could not be fetched"})
//     }else{
//       if(result.length === 0){
//         res.status(404).json({message:"Staff Allocation Data not found"})
//       }else{
//         res.status(200).json(result)
//       }
//     }
//   })

// })

  
router.put('/updateStaffAllocation/:staff_allocation_id', (req, res) => {
  const staff_allocation_id = req.params.staff_allocation_id;
  const { staff_id, cls_id, sec_id, sub_allocation_id, is_class_advisor, academic_year, cls_advisor_id } = req.body;
  const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  const updateStaffAllocation = `UPDATE staff_allocation SET staff_id=?, sub_allocation_id=?, updated_at=? WHERE staff_allocation_id=?`;
  const updateClsAdvisor = `UPDATE class_advisor SET staff_id=?, cls_id=?, sec_id=?, academic_year=?, updated_at=? WHERE cls_advisor_id=?`;
  const insertClsAdvisor = `insert into class_advisor(staff_id,cls_id,sec_id,academic_year,created_at) values(?,?,?,?,?)`;
  const getClsAdvisorData = `SELECT * FROM class_advisor WHERE cls_advisor_id=?`;
  const dltClsAdvisor = `DELETE FROM class_advisor WHERE cls_advisor_id=?`;

  db.query(updateStaffAllocation, [staff_id, sub_allocation_id, currentDate, staff_allocation_id], (AllocationErr, AllocationRes) => {
      if (AllocationErr) {
          return res.status(500).json({ message: 'Internal Server Error. Staff Allocation data could not be updated.' });
      }

      if (is_class_advisor === 'yes') {
        if(is_class_advisor === 'yes' && cls_advisor_id){
          db.query(updateClsAdvisor, [staff_id, cls_id, sec_id, academic_year, currentDate, cls_advisor_id], (updateClsAderr, updateClsAdRes) => {
              if (updateClsAderr) {
                  return res.status(500).json({ message: "Class Advisor Data could not be updated." });
                  
              }
              res.status(200).json({ message: "Class Advisor Data updated Successfully." });
          });}else{
            db.query(insertClsAdvisor,[staff_id,cls_id,sec_id,academic_year,currentDate],(insertAdvisorErr,insertAdvisorRes)=>{
              if(insertAdvisorErr){
                res.status(500).json({message:"Class advisor data could not be inserted."})
              }else{
                res.status(200).json({message:"Class Advisor data inserted successfully."})
              }
            })
          }
      } else {
          db.query(getClsAdvisorData, [cls_advisor_id], (getAdvisorErr, getAdvisorRes) => {
              if (getAdvisorErr) {
                  return res.status(500).json({ message: "Class Advisor data could not be fetched." });
              }
              if (getAdvisorRes.length === 0) {
                  return res.status(404).json({ message: `Class Advisor data not found for this ${cls_advisor_id}` });
              }

              db.query(dltClsAdvisor, [cls_advisor_id], (clsAdvisorDltErr, clsAdvisorDltRes) => {
                  if (clsAdvisorDltErr) {
                      return res.status(500).json({ message: "Class advisor data could not be deleted." });
                  }
                  res.status(200).json({ message: "Class Advisor data deleted Successfully" });
              });
          });
      }
  });
});


router.delete('/deleteStaffAllocation/:staff_allocation_id', (req, res) => {
  const staff_allocation_id = req.params.staff_allocation_id;
  const { cls_advisor_id } = req.body;
  console.log(cls_advisor_id);
  const getClsAdvisorData = `SELECT * FROM class_advisor WHERE cls_advisor_id=?`;
  const dltStaffAllocation = `DELETE FROM staff_allocation WHERE staff_allocation_id=?`;

  if (cls_advisor_id) {
      db.query(getClsAdvisorData, cls_advisor_id, (getAdvisorErr, getAdvisorRes) => {
          if (getAdvisorErr) {
              return res.status(500).json({ message: "Class Advisor data could not be fetched" });
          }
          if (getAdvisorRes.length === 0) {
              return res.status(404).json({ message: "Class Advisor Not found" });
          }
          // Display message for user indicating that the staff is a class advisor
          res.status(400).json({ message: "This staff is a class advisor. Please edit the staff to remove the advisor status before deleting." });
      });
  } else {
      db.query(dltStaffAllocation, staff_allocation_id, (dltAllcocationErr, dltAllocationRes) => {
          if (dltAllcocationErr) {
              return res.status(500).json({ message: "Staff Allocation data could not be deleted" });
          }
          res.status(200).json({ message: "Staff Allocation Data deleted Successfully." });
      });
  }
});



// Get Office Staff 

router.get('/getOfficeAdmission',(req,res)=>{
  const getData = `select * from staffs_master where role_id = 6 and isAlive = 1`;
  db.query(getData,(err,result)=>{
    if(err){
      res.status(500).json({message:"Internal Server Error. Data could not be fetched"})
    }else{
      if(result.length === 0){
        res.status(404).json({message:"Office Addminstrator data not found."})
      }else{
        res.status(200).json(result)
      }
    }
  })
})


router.get("/getTeachingStaff", (req, res) => {
  const getData = `
  select staff.* , dept.dept_name,role.role_name from staffs_master staff
    inner join department dept on staff.dept_id = dept.dept_id 
    inner join role on staff.role_id  = role.role_id where staff.isAlive = 1 and staff.dept_id = 2;
                     `;
  db.query(getData, (err, result) => {
    if (err) {
      res
        .status(500)
        .json({
          message: "Internal Server Error.Staff Data Could Not Be Fetched",
        });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Staff Data Not Found" });
      } else {
        const convertImage = result.map((staff) => ({
          ...staff,
          staff_img: staff.staff_img.toString("base64"),
        }));
        res.status(200).json(convertImage);
      }
    }
  });
});

router.get('/checkClsTeacherAvailable', (req, res) => {
  const { cls_id, sec_id, academic_year } = req.query;
  const checkQuery = `SELECT * FROM class_advisor WHERE cls_id = ? AND sec_id = ? AND academic_year = ?`;
  
  db.query(checkQuery, [cls_id, sec_id, academic_year], (err, result) => {
      if (err) {
          console.error("Error checking class teacher availability:", err);
          res.status(500).json({ message: "Internal Server Error. Could not check class advisor" });
      } else {
          if (result.length === 0) {
              // No class teacher found for the specified class, section, and academic year
              res.json({ available: true });
              console.log("Class teacher available:", true);
          } else {
              // Class teacher already assigned for the specified class, section, and academic year
              res.json({ available: false });
              console.log("Class teacher available:", true);
          }
      }
  });
});


router.get('/getStaffById',(req,res)=>{
  const staff_id = req.query.staff_id;
  const getQuery = `select * from staffs_master where staff_id = ?`
  db.query(getQuery,staff_id,(err,result)=>{
    if(err){
      res.status(500).json({message:"Internal server error.Data could not be fetched"})
    }else{
      if(result.length === 0){
        res.status(404).json({message:"Data not found"})
      }else{
        const convertImage = result.map((staff) => ({
          ...staff,
          staff_img: staff.staff_img.toString("base64"),
        }));
        res.status(200).json(convertImage);
      }
    }
  })
})


  return router;
};
