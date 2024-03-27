import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../../../ApiConfig/config';
import moment from "moment"
import { Button, Grid, MenuItem, TextField } from '@mui/material';

function UpdateExamMasterMark({data,onClose}) {

    const [staffData,setStaffData] = useState([])
    const [clsData,setClsData] = useState([]);
    const [secData,setSecData] = useState([])
    const [subData,setSubData] = useState([])
    const [examData,setExamData] = useState([])
    const [subExamData,setSubExamData] = useState([])
    const [studentsData,setStudentsData] = useState([])

    const [updateData,setUpdateData] = useState({
        staff_id : data ? data.staff_id : '',
        stu_allocation_id : data ? data.stu_allocation_id : '',
        cls_id : data ? data.cls_id : '',
        sec_id : data ? data.sec_id : '',
        sub_allocation_id : data ? data.sub_allocation_id : '',
        exam_id : data ? data.exam_id : '',
        sub_exam_id : data ? data.sub_exam_id : '',
        mark : data ? data.mark : '',
        academic_year : data ? data.academic_year : '',


    });
    const [errors,setErrors] = useState({
        staff_id : '',
        stu_allocation_id : '',
        cls_id : '',
        sec_id : '',
        sub_allocation_id : '',
        exam_id : '',
        sub_exam_id : '',
        mark : '',
        academic_year : '',
    })

    useEffect(()=>{
        axios.get(`${config.apiurl}/staff/getStaff`)
        .then((res)=>{
            setStaffData(res.data)
        })
        .catch((error)=>{
            console.log("Error :",error)
        })
    },[updateData.staff_id])

    useEffect(()=>{
        if(updateData.staff_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${updateData.staff_id}`)
            .then((res)=>{
                setClsData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[updateData.staff_id])

    useEffect(()=>{
        if(updateData.staff_id && updateData.cls_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${updateData.staff_id}&clsId=${updateData.cls_id || ''}`)
            .then((res)=>{
                setSecData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[updateData.staff_id,updateData.cls_id])


    useEffect(()=>{
        if(updateData.staff_id && updateData.cls_id && updateData.sec_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${updateData.staff_id}&clsId=${updateData.cls_id || ''}&secId=${updateData.sec_id || ''}`)
            .then((res)=>{
                setSubData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[updateData.staff_id,updateData.cls_id,updateData.sec_id])

    useEffect(()=>{
        axios.get(`${config.apiurl}/mark/getExamMaster`)
        .then((res)=>{
            setExamData(res.data)
        })
        .catch((error)=>{
            console.log("Error :",error)
        })
    },[updateData.exam_id])

    useEffect(()=>{
        if(updateData.exam_id){
            axios.get(`${config.apiurl}/mark/getSubExam?exam_id=${updateData.exam_id}`)
            .then((res)=>{
                setSubExamData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
        
    },[updateData.exam_id])

    useEffect(()=>{
        if(updateData.cls_id && updateData.sec_id && updateData.academic_year){
            axios.get(`${config.apiurl}/mark/getStudentRollNoForMark?cls_id=${updateData.cls_id}&sec_id=${updateData.sec_id}&academic_year=${updateData.academic_year}`)
            .then((res)=>{
                setStudentsData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
        
    },[updateData.cls_id,updateData.sec_id,updateData.academic_year])


    useEffect(() => {
        setUpdateData(prevUpdateData => ({
            ...prevUpdateData,
            sub_exam_id: '' // Resetting sub_exam_id to an empty string
        }));
    }, [updateData.exam_id]);

    const handleValidation = (name,value) =>{
        let errMsg = '';
        const trimmedValue = value && typeof value === 'string' ? value.trim() : value;

        switch (name){

            case 'cls_id':
                if(!trimmedValue){
                    errMsg = "Class Name is Required"
                }
                break;
            case 'sec_id':
                if(!trimmedValue){
                    errMsg = 'Section Name is Required'
                }
                break;
            case 'sub_allocation_id':
                if(!trimmedValue){
                    errMsg = 'Subject Name is Required'
                }
                break;
            case 'exam_id':
                if(!trimmedValue){
                    errMsg = 'Exam Name is Required'
                }
                break;
            case 'sub_exam_id':
                const validExamIDs = [1, 2, 3];
                if (validExamIDs.includes(updateData.exam_id) && !trimmedValue) {
                    errMsg = 'Please Select Exam Type';
                }
                break;
            case 'mark':
                if(!trimmedValue){
                    errMsg = 'Mark is Required'
                }
                break;
            case 'academic_year':
                if(!trimmedValue){
                    errMsg = "Academic Year is Required"
                }
                break;
            case 'stu_allocation_id':
                if(!trimmedValue){
                    errMsg = 'Roll Number is Required'
                }
                break;
            case 'staff_id':
                if(!trimmedValue){
                    errMsg = "Please Select Staff"
                }
                break
            default :
            break
            
        }
        return errMsg
    }

    const handleChangeInput = (e) =>{
        const {name,value} = e.target;
        const error = handleValidation(name,value)
        setErrors({...errors,[name]:error})
        if(!error){
            setUpdateData({...updateData,[name]:value})
        }
        
    }

    const cur_year = parseInt(moment().format('YYYY'));
    const pre_year = cur_year - 1
    const next_year = cur_year + 1 


    const handleSubmit = (e) =>{
        e.preventDefault()
        let formErr = {}

        Object.keys(updateData).forEach((name)=>{
            const value = updateData[name];
            const error = handleValidation(name,value)
            if(error){
                formErr[name] = error
            }
        })

    if(Object.keys(formErr).length === 0){
        axios.put(`${config.apiurl}/mark/updateExamMasterMark/${data.mark_id}`,updateData)
        .then((res)=>{
            console.log("Data updated Successfully.")
            onClose()
        })
        .catch((error)=>{
            console.log("Error:",error)
        })
    }else{
        setErrors(formErr)
    }
    }

    const handleClear = () =>{
        setUpdateData({
            staff_id : updateData.staff_id,
            stu_allocation_id : '',
            cls_id : '',
            sec_id : '',
            sub_allocation_id : '',
            exam_id : '',
            sub_exam_id : '',
            mark : '',
            academic_year : '', 
        })
        setErrors({
            staff_id : '',
            stu_allocation_id : '',
            cls_id : '',
            sec_id : '',
            sub_allocation_id : '',
            exam_id : '',
            sub_exam_id : '',
            mark : '',
            academic_year : '', 
        })
    }

  return (
    <>
    <Grid container spacing={3} className='mt-3'>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            name='cls_id'
            label = "Select Class"
            value={updateData.cls_id}
            onChange={handleChangeInput}
            error = {!!errors.cls_id}
            helperText = {errors.cls_id}
            >
                {clsData.map((cls,index)=>(
                    <MenuItem key={index} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            name='sec_id'
            label = "Select Section"
            value={updateData.sec_id}
            onChange={handleChangeInput}
            error = {!!errors.sec_id}
            helperText = {errors.sec_id}
            >
                {secData.map((sec,index)=>(
                    <MenuItem key={index} value={sec.sec_id}>{sec.sec_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            name='sub_allocation_id'
            label = "Select Subject"
            value={updateData.sub_allocation_id}
            onChange={handleChangeInput}
            error = {!!errors.sub_allocation_id}
            helperText = {errors.sub_allocation_id}
            >
                {subData.map((sub,index)=>(
                    <MenuItem key={index} value={sub.sub_allocation_id}>{sub.sub_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            name='exam_id'
            label = "Select Exam"
            value={updateData.exam_id}
            onChange={handleChangeInput}
            error = {!!errors.exam_id}
            helperText = {errors.exam_id}
            >
                {examData.map((exam,index)=>(
                    <MenuItem key={index} value={exam.exam_id}>{exam.exam_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        {updateData.exam_id === 4 || updateData.exam_id === 5 || updateData.exam_id === 6 ? (
    <>
        
    </>
) : (<>
<Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
                fullWidth
                select
                name='sub_exam_id'
                label='Select Month'
                value={updateData.sub_exam_id}
                onChange={handleChangeInput}
                error={!!errors.sub_exam_id}
                helperText={errors.sub_exam_id}
            >
                {subExamData.map((subEx, index) => (
                    <MenuItem key={index} value={subEx.sub_exam_id}>{subEx.sub_exam_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
</>)}
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Academic Year"
            name = "academic_year"
            value = {updateData.academic_year}
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
            name='stu_allocation_id'
            label = "Select Roll Number"
            value={updateData.stu_allocation_id}
            onChange={handleChangeInput}
            error = {!!errors.stu_allocation_id}
            helperText = {errors.stu_allocation_id}
            >
                {studentsData.map((stu,index)=>(
                    <MenuItem key={index} value={stu.stu_allocation_id}>{stu.roll_no}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            name='mark'
            label = "Please Enter Mark"
            value={updateData.mark}
            onChange={handleChangeInput}
            error = {!!errors.mark}
            helperText = {errors.mark}
            />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            name='staff_id'
            label = "Staff Name"
            value={updateData.staff_id}
            onChange={handleChangeInput}
            disabled
            error = {!!errors.staff_id}
            helperText = {errors.staff_id}
            >
                {staffData.map((staff,index)=>(
                    <MenuItem key={index} value={staff.staff_id}>{staff.staff_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={12} xs={12} md={12} sm={12} style={{display:'flex',justifyContent:'center'}} >
            <Button onClick={handleSubmit} variant='contained'>Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={handleClear} className="btn bg-danger text-white">Clear</Button>
          </Grid>
    </Grid>

    </>
  )
}

export default UpdateExamMasterMark