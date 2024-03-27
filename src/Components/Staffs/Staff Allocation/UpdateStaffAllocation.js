import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config';
import { Button, Grid, MenuItem, TextField } from '@mui/material';

function UpdateStaffAllocation({data}) {
    const [staffData, setStaffData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [subjectData,setSubjectData] = useState([]);

    const [updateData,setUpdateData] = useState({
        staff_id : data ? data.staff_id : '',
        cls_id : data ? data.cls_id : '',
        sec_id : data ? data.sec_id : '',
        sub_allocation_id : data ? data.sub_allocation_id : '',
        is_class_advisor : data ? data.is_class_advisor : '',
        academic_year : data ? data.academic_year : '',
        cls_advisor_id : data.cls_advisor_id
    });

    const [errors,setErrors] = useState({
        staff_id: '',
        cls_id: '',
        sec_id: '',
        sub_allocation_id: '',
        is_class_advisor: '', 
        academic_year: '' 
    })


    useEffect(() => {
        axios.get(`${config.apiurl}/staff/getStaff`)
            .then((res) => {
                setStaffData(res.data);
            }).catch((error) => {
                console.log("Error :", error);
            });
    }, []);

    useEffect(()=>{
        axios.get(`${config.apiurl}/subject/getSubByClsAndSec`)
            .then((res) => {
                setClsData(res.data);
            }).catch((error) => {
                console.log("Error :", error);
            });
    },[])

    useEffect(() => {
        
        if (updateData.cls_id) {
            axios.get(`${config.apiurl}/subject/getSubByClsAndSec/${updateData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                }).catch((error) => {
                    console.log("Error :", error);
                });
        }
    }, [updateData.cls_id]);

    useEffect(() => {
        if (updateData.cls_id && updateData.sec_id) {
            axios.get(`${config.apiurl}/subject/getSubByClsAndSec/${updateData.cls_id}/${updateData.sec_id}`)
                .then((res) => {
                    setSubjectData(res.data);
                }).catch((error) => {
                    console.log("Error :", error);
                });
        }
    }, [updateData.cls_id,updateData.sec_id]);

    const handleValidation = (name,value)=>{
        let errMsg = '';
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value ;
        switch(name){
            case "staff_id":
                if(!trimmedValue){
                    errMsg = "Staff Name is Required"
                }
                break;
            case "cls_id":
                if(!trimmedValue){
                    errMsg = "Class Name is Required"
                }
                break;
            case "sec_id":
                if(!trimmedValue){
                    errMsg = "Section Name is Required"
                }
                break;
            case "sub_allocation_id":
                if(!trimmedValue){
                    errMsg = "Subject Name is Required"
                }
                break;
            case "is_class_advisor":
                if(!trimmedValue){
                    errMsg = "Provide one Valid answer"
                }
                break;
            case "academic_year":
                if(updateData.is_class_advisor == 'yes'){
                    if(!trimmedValue){
                        errMsg = "Academic year is Required"
                    }
                }
            default :
            break;
        }
        return errMsg;
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        const error = handleValidation(name,value);
        setErrors({...errors,[name]:error});
        if(!error){
            setUpdateData({ ...updateData, [name]: value });
        }
        
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        let formErr = {};
    
        Object.keys(updateData).forEach((name) => {
            const value = updateData[name];
            const error = handleValidation(name, value);
            if (error) {
                formErr[name] = error;
            }
        });
    
        if (Object.keys(formErr).length === 0) {
            axios.put(`${config.apiurl}/staff/updateStaffAllocation/${data.staff_allocation_id}`,updateData)
            .then((res)=>{
                console.log("Data Updated Successfully.",updateData)
            })
            .catch((error)=>{
                console.error("Error :",error)
            })
        } else {
            setErrors(formErr);
        }
    };
  return (
    <div>
        <Grid spacing={3} container>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label='Select Staff'
                        name='staff_id'
                        value={updateData.staff_id}
                        onChange={handleChangeInput}
                        error = {!!errors.staff_id}
                        helperText = {errors.staff_id}
                    >
                        {staffData.map((staff) => (
                            <MenuItem key={staff.staff_id} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label='Select Class'
                        name='cls_id'
                        value={updateData.cls_id}
                        onChange={handleChangeInput}
                        error = {!!errors.cls_id}
                        helperText = {errors.cls_id}
                    >
                        {clsData.map((cls) => (
                            <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label='Select Section'
                        name='sec_id'
                        value={updateData.sec_id}
                        onChange={handleChangeInput}
                        error = {!!errors.sec_id}
                        helperText = {errors.sec_id}
                    >
                        {secData.map((sec) => (
                            <MenuItem key={sec.sec_id} value={sec.sec_id}>{sec.sec_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label='Select Subject'
                        name='sub_allocation_id'
                        value={updateData.sub_allocation_id}
                        onChange={handleChangeInput}
                        error = {!!errors.sub_allocation_id}
                        helperText = {errors.sub_allocation_id}
                    >
                        {subjectData.map((sub) => (
                            <MenuItem key={sub.sub_allocation_id} value={sub.sub_allocation_id}>{sub.sub_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        select
                        label='Is Class Advisor?'
                        name='is_class_advisor'
                        value={updateData.is_class_advisor}
                        onChange={handleChangeInput}
                        error = {!!errors.is_class_advisor}
                        helperText = {errors.is_class_advisor}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </TextField>
                </Grid>
                {updateData.is_class_advisor == 'yes' ? (<>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                    <TextField
                        fullWidth
                        label='Academic Year'
                        name='academic_year'
                        value={updateData.academic_year}
                        onChange={handleChangeInput}
                        error = {!!errors.academic_year}
                        helperText = {errors.academic_year}
                    />
                </Grid>
                </>):(<></>)}
                <Grid item lg={12} md={12} sm={12} xs={12} style={{display:'flex',justifyContent:"center"}}>
                    <Button onClick={handleUpdate}>Submit</Button>
                </Grid>
            </Grid>
    </div>
  )
}

export default UpdateStaffAllocation
