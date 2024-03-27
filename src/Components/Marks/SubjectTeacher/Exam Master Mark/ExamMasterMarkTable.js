import { Button, Dialog, DialogActions, DialogContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../../ApiConfig/config';
import UpdateExamMasterMark from './UpdateExamMasterMark';

function ExamMasterMarkTable({ data }) {
  const [examMark, setExamMark] = useState([]);
  const [openUpdate,setOpenUpdate] = useState(false);
  const [updateData,setUpdateData] = useState();
  const [openDlt,setOpenDlt] = useState(false);
  const [dltData,setDltData] = useState();

  useEffect(() => {
    axios.get(`${config.apiurl}/mark/getExamMasterMarkBYSubAllAndStaffId?staff_id=${data.staff_id}&sub_allocation_id=${data.sub_allocation_id}&exam_id=${data.exam_id}&academic_year=${data.academic_year}`)
      .then((res) => {
        setExamMark(res.data);
      })
      .catch((error) => {
        console.log("Error :", error);
      });
  }, [data,openUpdate,openDlt]);

  const handleUpdate = (mark_id) =>{
    const selectedData = examMark.find((mark)=>mark.mark_id === mark_id);
    if(selectedData){
      setUpdateData(selectedData)
      setOpenUpdate(true)
    }
  }

  const handleOpenDlt = (mark_id) =>{
    if(mark_id){
      setDltData(mark_id)
      setOpenDlt(true)
    }

  }

  const confirmDlt = () =>{
    if(dltData){
      axios.delete(`${config.apiurl}/mark/deleteExamMasterMark/${dltData}`)
      .then((res)=>{
        setOpenDlt(false)
      })
      .catch((error)=>{
        console.log("Failed to delete :",error)
      })
    }
  }



  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Class Name</TableCell>
              <TableCell>Section Name</TableCell>
              <TableCell>Exam Name</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Mark</TableCell>
              <TableCell>Academic Year</TableCell>
              <TableCell>Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {examMark.map((mark, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{mark.roll_no}</TableCell>
                <TableCell>{mark.stu_name}</TableCell>
                <TableCell>{mark.cls_name}</TableCell>
                <TableCell>{mark.sec_name}</TableCell>
                <TableCell>{mark.exam_name}</TableCell>
                <TableCell>{mark.sub_name}</TableCell>
                <TableCell>{mark.mark}</TableCell>
                <TableCell>{mark.academic_year}</TableCell>
                <TableCell>
                  <Button onClick={()=>handleUpdate(mark.mark_id)}>Update</Button>
                  <Button onClick={()=>handleOpenDlt(mark.mark_id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open = {openUpdate} onClose={()=>setOpenUpdate(false)}>
        <DialogContent>
          <UpdateExamMasterMark data = {updateData} onClose={()=>setOpenUpdate(false)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openDlt} onClose={()=>setOpenDlt(false)}>
      <DialogContent>
      <p>Are you sure you want to delete this Student Mark?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmDlt} variant = 'contained' style={{backgroundColor: "#DC143C", color: "white"}}>Ok</Button>
        <Button onClick={()=>setOpenDlt(false)} variant = 'contained' style={{ backgroundColor: "#1B9C85", color: "white"}}>Close</Button>
      </DialogActions>
    </Dialog> 
    </>
  );
}

export default ExamMasterMarkTable;

