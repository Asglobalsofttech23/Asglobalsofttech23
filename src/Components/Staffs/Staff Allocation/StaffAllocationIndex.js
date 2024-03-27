import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import UpdateStaffAllocation from './UpdateStaffAllocation';
import config from '../../../ApiConfig/config';

function StaffAllocationIndex() {
    const [staffData,setStaffData] = useState([]);
    const [updatedData,setUpdateData] = useState()
    const [openUpdateDialog,setOpenUpdateDialog] = useState(false)
    const [dltData , setDltData] = useState();
    const [openDltDialog,setOpenDltDialog] = useState(false);
    const [openErr,setOpenErr] = useState(false);
    const [errMsg,setErrMsg] = useState('');
    

    useEffect(()=>{
        axios.get(`${config.apiurl}/staff/getStaffAllocation`)
        .then((res)=>{
            setStaffData(res.data)
            console.log(res.data)
        })
        .catch((error)=>{
            console.log("Error",error)
        })
    },[])

    const updateStaff = (staff_allocation_id) =>{
        const selectData = staffData.find((staff)=>staff.staff_allocation_id === staff_allocation_id);
        if(selectData){
            setUpdateData(selectData);
            setOpenUpdateDialog(true)
        }
    }


    const handleDlt = (staff_allocation_id) =>{
        const selectData = staffData.find((staff)=>staff.staff_allocation_id === staff_allocation_id);
        if(selectData){
            setDltData(selectData);
            setOpenDltDialog(true)
        }
    }

    const confirmDlt = () =>{
        if(dltData){
            axios.delete(`${config.apiurl}/staff/deleteStaffAllocation/${dltData.staff_allocation_id}`, { data: { cls_advisor_id: dltData.cls_advisor_id } })
            .then((res)=>{
                console.log("Staff Data deleted Successfully")
                setOpenDltDialog(false)
            })
            .catch((error)=>{
                if(error.response){
                    setOpenErr(true)
                    setErrMsg(error.response.data.message);
                }else{
                    setOpenErr(true)
                    setErrMsg("Could Not be Delete this Employee") 
                }
                
                
            })
        }
    }

  return (
    <div>
        
      <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>S.No</TableCell>
                    <TableCell>Staff Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {staffData.map((staff,index)=>(
                    <TableRow key={index}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{staff.staff_name}</TableCell>
                        <TableCell>{staff.cls_name}</TableCell>
                        <TableCell>{staff.sec_name}</TableCell>
                        <TableCell>{staff.sub_name}</TableCell>
                        <TableCell>
                            <Button onClick={()=>updateStaff(staff.staff_allocation_id)}>Update</Button>
                            <Button onClick={()=>handleDlt(staff.staff_allocation_id)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
                
            </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openUpdateDialog} onClose={()=>setOpenUpdateDialog(false)}>
        <DialogTitle className='bg-primary text-white text-center'>Update Staff</DialogTitle>
        <DialogContent>
            <UpdateStaffAllocation data = {updatedData}/>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setOpenUpdateDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openErr} onClose={()=>setOpenErr(false)}>
        <DialogTitle className='bg-danger text-white text-center'>ERROR</DialogTitle>
        <DialogContent>
            <p>{errMsg}</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>setOpenErr(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDltDialog} onClose={()=>setOpenDltDialog(false)} maxWidth='md'>
        {/* <DialogTitle className='text-center bg-primary text-white'>Confirmation</DialogTitle> */}
        <DialogContent >
        <p>Are you sure you want to delete this employee?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDlt} variant = 'contained' style={{backgroundColor: "#DC143C", color: "white"}}>Ok</Button>
          <Button onClick={()=>setOpenDltDialog(false)} variant = 'contained' style={{ backgroundColor: "#1B9C85", color: "white"}}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default StaffAllocationIndex
