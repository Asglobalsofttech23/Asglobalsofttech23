import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config'
import UpdateStudentAllocation from './UpdateStudentAllocation'

function StudentAllocationTable() {

    const [studentsData,setStudentsData] = useState([])
    const [openUpdateDialog,setOpenUpdateDialog] = useState(false)
    const [openDlt,setOpenDlt] = useState(false)
    const [updateData,setUpdateData] = useState()
    const [dltData,setDltData] = useState()

    const handleUpdate = (stu_allocation_id) =>{
        const selectData = studentsData.find(stu=>stu.stu_allocation_id === stu_allocation_id);
        if(selectData){
            setUpdateData(selectData)
            setOpenUpdateDialog(true)
        }
    }


    const handleDlt = (stu_allocation_id) =>{
        
        if(stu_allocation_id){
            
            setDltData(stu_allocation_id)
            setOpenDlt(true)
            
        }

    }

    const confirmDlt = () => {
        if (dltData) {
          axios.delete(`${config.apiurl}/students/dltAllocation/${dltData}`)
            .then((res) => {
              setOpenDlt(false);
            })
            .catch((error) => {
              console.log("Error :", error);
            });
        }
      };
      
    useEffect(()=>{
        axios.get(`${config.apiurl}/students/getStudentAllocationData`)
        .then((res)=>{
            setStudentsData(res.data)
        })
        .catch((error)=>{
            console.log("Error : ",error)
        })
    })

  return (
    <>
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Class Name</TableCell>
                    <TableCell>Section Name</TableCell>
                    <TableCell>Roll Number</TableCell>
                    <TableCell>Academic Year</TableCell>
                    <TableCell>Class Teacher</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {studentsData.map((stu,index)=>(
                <TableRow key={index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{stu.stu_name}</TableCell>
                    <TableCell>{stu.cls_name}</TableCell>
                    <TableCell>{stu.sec_name}</TableCell>
                    <TableCell>{stu.roll_no}</TableCell>
                    <TableCell>{stu.academic_year}</TableCell>
                    <TableCell>{stu.staff_name}</TableCell>
                    <TableCell>
                        <Button onClick={()=>handleUpdate(stu.stu_allocation_id)}>Update</Button>
                        <Button onClick={()=>handleDlt(stu.stu_allocation_id)}>Delete</Button>
                    </TableCell>
                </TableRow>
                ))}
                
            </TableBody>
        </Table>
    </TableContainer>

    <Dialog open={openUpdateDialog} onClose={()=>setOpenUpdateDialog(false)}>
        <DialogContent>
            <UpdateStudentAllocation data = {updateData} onClose = {()=>setOpenUpdateDialog(false)}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setOpenUpdateDialog(false)}>Close</Button>
        </DialogActions>
    </Dialog>

    
    <Dialog open={openDlt} onClose={() => setOpenDlt(false)} maxWidth='md'>
  <DialogContent>
    <p>Are you sure you want to delete this Student Allocation?</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={confirmDlt} variant='contained' style={{ backgroundColor: "#DC143C", color: "white", marginRight: "10px" }}>Ok</Button>
    <Button onClick={() => setOpenDlt(false)} variant='contained' style={{ backgroundColor: "#1B9C85", color: "white" }}>Close</Button>
  </DialogActions>
</Dialog>


    </>
  )
}

export default StudentAllocationTable