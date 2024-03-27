import { Button, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config';

function UpdateStudentAllocation({data,onClose}) {
    useEffect(()=>{
        console.log(data)
    },[])

    const staff = sessionStorage.getItem('staff_id') , 
    cls = sessionStorage.getItem('cls_id'),
    sec = sessionStorage.getItem('sec_id');

    const [stu_data,setStu_data] = useState([])
    const [clsAndSecData,setClsAndSecData] = useState([])
    const [staffData,setStaffData] = useState([])

    const [updateData,setUpdateData] = useState({
        stu_id : data ? data.stu_id : '',
        cls_id : data ? data.cls_id : '',
        sec_id : data ? data.sec_id : '',
        roll_no : data ? data.roll_no : '',
        academic_year : data ? data.academic_year : '',
        staff_id : data ? data.staff_id : ''
    })

    const [errors,setErrors] = useState({
        stu_id : "",
        cls_id : "",
        sec_id : "",
        roll_no : "",
        academic_year : "",
        staff_id : "",
    })

    useEffect(()=>{
        if(cls){
            axios.get(`${config.apiurl}/students/getStudentByClass?cls_id=${cls}`)
            .then((res)=>{
                setStu_data(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[cls])

    useEffect(()=>{
        if(cls && sec){
            axios.get(`${config.apiurl}/class/getClsAndSecByIdForStuAll?cls_id=${cls}&sec_id=${sec}`)

            .then((res)=>{
                setClsAndSecData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[cls,sec])

    useEffect(()=>{
        if(staff){
            axios.get(`${config.apiurl}/staff/getStaffById?staff_id=${staff}`)
            .then((res)=>{
                setStaffData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    })



    const handleValidation = (name,value) =>{
        let errMsg = "";
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value ;
    
        switch(name){
            case 'stu_id':
                if(!trimmedValue){
                    errMsg = "Student Name is Required"  
                }
                break;
            case 'cls_id':
                if(!trimmedValue){
                    errMsg = "Class Name is Required"  
                }
                break;
            case 'sec_id':
                if(!trimmedValue){
                    errMsg = "Section Name is Required"
                }
                break;
            case 'roll_no':
                if(!trimmedValue){
                    errMsg = "Roll Number is Required"
                }
                break;
            case 'academic_year':
                if(!trimmedValue){
                    errMsg = "Academic Year is Required" 
                }
                break;
            case 'staff_id':
                if(!trimmedValue){
                    errMsg = "Staff Name is Required"
                }
                break;
            default :
                break;
        }
        return errMsg;
       }

       const handleInputChange = (e) =>{
        const {name,value} = e.target;
        const error = handleValidation(name,value);
        setErrors({...errors,[name]:error})
        if(!error){
            setUpdateData({...updateData,[name]:value})
        }
       }
    
    
       const cur_year = parseInt(moment().format('YYYY'));
        const pre_year = cur_year - 1
        const next_year = cur_year + 1 


        const handleUpdate = (e) =>{
            e.preventDefault()
            let formErr = {}

            Object.keys(updateData).forEach((name)=>{
                const value = updateData[name]
                const error = handleValidation(name,value)
                if(error){
                    formErr[name] = error
                }
            })

            if(Object.keys(formErr).length === 0){
                axios.put(`${config.apiurl}/students/updateStuAllocation/${data.stu_allocation_id}`,updateData)
                .then((res)=>{
                    setUpdateData({
                        stu_id : "",
                        cls_id : "",
                        sec_id : "",
                        roll_no : "",
                        academic_year : "",
                        staff_id : "",
                    });
                    onClose();
                    console.log("Data Updated Successfully.",updateData)

                })
            }else{
                setErrors(formErr)
            }
        }

        const handleClear = () =>{
            setUpdateData({
                stu_id : "",
                cls_id : "",
                sec_id : "",
                roll_no : "",
                academic_year : "",
                staff_id : "",
            });
            setErrors({
                stu_id : "",
                cls_id : "",
                sec_id : "",
                roll_no : "",
                academic_year : "",
                staff_id : "",
            })
           }

  return (
    <>
    <h1 className='text-center mt-2'>Update Allocation</h1>
    <Grid spacing={3} container className='mt-2'>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Select Student"
            name = "stu_id"
            value = {updateData.stu_id}
            onChange={handleInputChange}
            error = {!!errors.stu_id}
            helperText = {errors.stu_id}
            >
                {stu_data.map((stu,index)=>(
                    <MenuItem key={index} value={stu.stu_id}>{stu.stu_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Select Class"
            name = "cls_id"
            value = {updateData.cls_id}
            onChange={handleInputChange}
            error = {!!errors.cls_id}
            helperText = {errors.cls_id}
            >
                {clsAndSecData.map((cls,index)=>(
                    <MenuItem key={index} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Select Section"
            name = "sec_id"
            value = {updateData.sec_id}
            onChange={handleInputChange}
            error = {!!errors.sec_id}
            helperText = {errors.sec_id}
            >
                {clsAndSecData.map((sec,index)=>(
                    <MenuItem key={index} value={sec.sec_id}>{sec.sec_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            label = "Roll Number"
            name = "roll_no"
            value = {updateData.roll_no}
            onChange={handleInputChange}
            error = {!!errors.roll_no}
            helperText = {errors.roll_no}
            />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Academic Year"
            name = "academic_year"
            value = {updateData.academic_year}
            onChange={handleInputChange}
            error = {!!errors.academic_year}
            helperText = {errors.academic_year}
            >
<MenuItem value={`${pre_year}-${cur_year}`}>{pre_year}-{cur_year}</MenuItem>
                        <MenuItem value={`${cur_year}-${next_year}`}>{cur_year}-{next_year}</MenuItem>
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Select Staff"
            name = "staff_id"
            value = {updateData.staff_id}
            onChange={handleInputChange}
            error = {!!errors.staff_id}
            helperText = {errors.staff_id}
            >
                {staffData.map((staff,index)=>(
                    <MenuItem key={index} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleUpdate} variant='contained' style={{marginRight:'5px'}}>Submit</Button>
            <Button onClick={handleClear} style={{backgroundColor:'red',color:'white',marginLeft:'5px'}}>Clear</Button>
        </Grid>
    </Grid>
    </>
  )
}

export default UpdateStudentAllocation