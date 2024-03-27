import { Button, Grid, Menu, MenuItem, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import config from '../../../ApiConfig/config';
import axios from 'axios';
import StaffAllocationIndex from './StaffAllocationIndex';
import moment from 'moment'

function StaffAllocation() {
    const [staffData, setStaffData] = useState([]);
    const [clsData, setClsData] = useState([]);
    const [secData, setSecData] = useState([]);
    const [subjectData,setSubjectData] = useState([]);
    const [clsTeacherAvailable,setClasTeacherAvailable] = useState(false)
    const [formData, setFormData] = useState({
        staff_id: '',
        cls_id: '',
        sec_id: '',
        sub_allocation_id: '',
        academic_year: '' ,
        is_class_advisor: '', 
        
    });

    const [errors,setErrors] = useState({
        staff_id: '',
        cls_id: '',
        sec_id: '',
        sub_allocation_id: '',
        academic_year: '' ,
        is_class_advisor: '', 
        
    })

    const cur_year = parseInt(moment().format('YYYY'));
    const pre_year = cur_year - 1
    const next_year = cur_year + 1
    


    useEffect(() => {
        axios.get(`${config.apiurl}/staff/getTeachingStaff`)
            .then((res) => {
                setStaffData(res.data);
            }).catch((error) => {
                console.log("Error :", error);
            });

        axios.get(`${config.apiurl}/subject/getSubByClsAndSec`)
            .then((res) => {
                setClsData(res.data);
            }).catch((error) => {
                console.log("Error :", error);
            });
    }, []);

    useEffect(() => {
        
        if (formData.cls_id) {
            axios.get(`${config.apiurl}/subject/getSubByClsAndSec/${formData.cls_id}`)
                .then((res) => {
                    setSecData(res.data);
                }).catch((error) => {
                    console.log("Error :", error);
                });
        }
    }, [formData.cls_id]);

    useEffect(() => {
        if (formData.cls_id && formData.sec_id) {
            axios.get(`${config.apiurl}/subject/getSubByClsAndSec/${formData.cls_id}/${formData.sec_id}`)
                .then((res) => {
                    setSubjectData(res.data);
                }).catch((error) => {
                    console.log("Error :", error);
                });
        }
    }, [formData.cls_id,formData.sec_id]);

    useEffect(() => {
        if (formData.cls_id && formData.sec_id && formData.academic_year) {
            axios.get(`${config.apiurl}/staff/checkClsTeacherAvailable?cls_id=${formData.cls_id}&sec_id=${formData.sec_id}&academic_year=${formData.academic_year}`)
                .then((res) => {
                    const { available } = res.data;
                    console.log(available)
                    setClasTeacherAvailable(available);
                })
                .catch((error) => {
                    console.error("Error checking class teacher availability:", error);
                    // Optionally, handle error states here
                });
        }
    }, [formData.cls_id, formData.sec_id, formData.academic_year]);
    

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
            // case "is_class_advisor":
            //     if(!trimmedValue){
            //         errMsg = "Provide one Valid answer"
            //     }
            //     break;
            case "academic_year":
                
                    if(!trimmedValue){
                        errMsg = "Academic year is Required"
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
            setFormData({ ...formData, [name]: value });
        }
        
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let formErr = {};
    
        Object.keys(formData).forEach((name) => {
            const value = formData[name];
            const error = handleValidation(name, value);
            if (error) {
                formErr[name] = error;
            }
        });
    
        if (Object.keys(formErr).length === 0) {
            axios.post(`${config.apiurl}/staff/postStaffAllocation`,formData)
            .then((res)=>{
                console.log("Data Added Successfully.",formData)
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
                        value={formData.staff_id}
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
                        value={formData.cls_id}
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
                        value={formData.sec_id}
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
                        label='Academic Year'
                        name='academic_year'
                        value={formData.academic_year}
                        onChange={handleChangeInput}
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
                        label='Select Subject'
                        name='sub_allocation_id'
                        value={formData.sub_allocation_id}
                        onChange={handleChangeInput}
                        error = {!!errors.sub_allocation_id}
                        helperText = {errors.sub_allocation_id}
                    >
                        {subjectData.map((sub) => (
                            <MenuItem key={sub.sub_allocation_id} value={sub.sub_allocation_id}>{sub.sub_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                {clsTeacherAvailable ? (
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                      <TextField
                          fullWidth
                          select
                          label='Is Class Advisor?'
                          name='is_class_advisor'
                          value={formData.is_class_advisor}
                          onChange={handleChangeInput}
                          error = {!!errors.is_class_advisor}
                          helperText = {errors.is_class_advisor}
                      >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                      </TextField>
                  </Grid>
                ) : (<></>)}
                
              
                
                <Grid item lg={12} md={12} sm={12} xs={12} style={{display:'flex',justifyContent:"center"}}>
                    <Button onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>

            <StaffAllocationIndex/>
        </div>
    );
}

export default StaffAllocation;
