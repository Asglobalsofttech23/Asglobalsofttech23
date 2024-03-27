import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import moment from 'moment'
import ExamMasterMarkTable from './Exam Master Mark/ExamMasterMarkTable'
import SubExamMarkTable from './Sub Exam Mark/SubExamMarkTable';


function AddMark() {
    const staff_id = sessionStorage.getItem('staff_id');
    const [staffData,setStaffData] = useState([])
    const [clsData,setClsData] = useState([]);
    const [secData,setSecData] = useState([])
    const [subData,setSubData] = useState([])
    const [examData,setExamData] = useState([])
    const [subExamData,setSubExamData] = useState([])
    const [studentsData,setStudentsData] = useState([])

    const [formData,setFormData] = useState({
        staff_id : staff_id,
        stu_allocation_id : '',
        cls_id : '',
        sec_id : '',
        sub_allocation_id : '',
        exam_id : '',
        sub_exam_id : '',
        mark : '',
        academic_year : '',

    })

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
    },[staff_id])

    useEffect(()=>{
        if(staff_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${staff_id}`)
            .then((res)=>{
                setClsData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[staff_id])

    useEffect(()=>{
        if(staff_id && formData.cls_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${staff_id}&clsId=${formData.cls_id || ''}`)
            .then((res)=>{
                setSecData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[staff_id,formData.cls_id])


    useEffect(()=>{
        if(staff_id && formData.cls_id && formData.sec_id){
            axios.get(`${config.apiurl}/mark/getAllocationDataForMark?staffId=${staff_id}&clsId=${formData.cls_id || ''}&secId=${formData.sec_id || ''}`)
            .then((res)=>{
                setSubData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
    },[staff_id,formData.cls_id,formData.sec_id])

    useEffect(()=>{
        axios.get(`${config.apiurl}/mark/getExamMaster`)
        .then((res)=>{
            setExamData(res.data)
        })
        .catch((error)=>{
            console.log("Error :",error)
        })
    },[formData.exam_id])

    useEffect(()=>{
        if(formData.exam_id){
            axios.get(`${config.apiurl}/mark/getSubExam?exam_id=${formData.exam_id}`)
            .then((res)=>{
                setSubExamData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
        
    },[formData.exam_id])

    useEffect(()=>{
        if(formData.cls_id && formData.sec_id && formData.academic_year){
            axios.get(`${config.apiurl}/mark/getStudentRollNoForMark?cls_id=${formData.cls_id}&sec_id=${formData.sec_id}&academic_year=${formData.academic_year}`)
            .then((res)=>{
                setStudentsData(res.data)
            })
            .catch((error)=>{
                console.log("Error :",error)
            })
        }
        
    },[formData.cls_id,formData.sec_id,formData.academic_year])

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            sub_exam_id: '' // Resetting sub_exam_id to an empty string
        }));
    }, [formData.exam_id]);

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
                    if (validExamIDs.includes(formData.exam_id) && !trimmedValue) {
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
            setFormData({...formData,[name]:value})
        }
        
    }

    const cur_year = parseInt(moment().format('YYYY'));
    const pre_year = cur_year - 1
    const next_year = cur_year + 1 

    const handleSubmit = (e) =>{
        e.preventDefault()
        let formErr = {}

        Object.keys(formData).forEach((name)=>{
            const value = formData[name];
            const error = handleValidation(name,value)
            if(error){
                formErr[name] = error
            }
        })

    if(Object.keys(formErr).length === 0){
        axios.post(`${config.apiurl}/mark/postMark`,formData)
        .then((res)=>{
            console.log(formData)
            setFormData(prevFormData =>({
                ...prevFormData,
                stu_allocation_id : '',
                mark : '',
    
            }))
        })
        .catch((error)=>{
            console.log("Failed to insert Data",error)
        })
     
        
    }else{
        setErrors(formErr)
    }
    }

    const handleClear = () =>{
        setFormData({
            staff_id : staff_id,
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
    const styles = {
        container: {
          margin : '20px',
          background: 'rgba(255, 255, 255, 0.6)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur(6.5px)',
          WebkitBackdropFilter: 'blur(6.5px)',
          borderRadius: '50px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      };
  return (
    <>
    <div style={styles.container}>
        <Grid container spacing={3} className='mt-3 container' style={{marginLeft:'50px'}}>
        <Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
            fullWidth
            select
            name='cls_id'
            label = "Select Class"
            value={formData.cls_id}
            onChange={handleChangeInput}
            error = {!!errors.cls_id}
            helperText = {errors.cls_id}
            >
                {clsData.map((cls,index)=>(
                    <MenuItem key={index} value={cls.cls_id}>{cls.cls_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
            fullWidth
            select
            name='sec_id'
            label = "Select Section"
            value={formData.sec_id}
            onChange={handleChangeInput}
            error = {!!errors.sec_id}
            helperText = {errors.sec_id}
            >
                {secData.map((sec,index)=>(
                    <MenuItem key={index} value={sec.sec_id}>{sec.sec_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
            fullWidth
            select
            name='sub_allocation_id'
            label = "Select Subject"
            value={formData.sub_allocation_id}
            onChange={handleChangeInput}
            error = {!!errors.sub_allocation_id}
            helperText = {errors.sub_allocation_id}
            >
                {subData.map((sub,index)=>(
                    <MenuItem key={index} value={sub.sub_allocation_id}>{sub.sub_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
            fullWidth
            select
            name='exam_id'
            label = "Select Exam"
            value={formData.exam_id}
            onChange={handleChangeInput}
            error = {!!errors.exam_id}
            helperText = {errors.exam_id}
            >
                {examData.map((exam,index)=>(
                    <MenuItem key={index} value={exam.exam_id}>{exam.exam_name}</MenuItem>
                ))}
            </TextField>
        </Grid>
        {formData.exam_id === 4 || formData.exam_id === 5 || formData.exam_id === 6 ? (
    <>
        
    </>
) : (<>
<Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
                fullWidth
                select
                name='sub_exam_id'
                label='Select Month'
                value={formData.sub_exam_id}
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

        <Grid item lg={2} md={2} sm={2} xs={12}>
            <TextField
            fullWidth
            select
            label = "Academic Year"
            name = "academic_year"
            value = {formData.academic_year}
            onChange={handleChangeInput}
            error = {!!errors.academic_year}
            helperText = {errors.academic_year}
            >
                    <MenuItem value={`${pre_year}-${cur_year}`}>{pre_year}-{cur_year}</MenuItem>
                        <MenuItem value={`${cur_year}-${next_year}`}>{cur_year}-{next_year}</MenuItem>
            </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={12}>
            <TextField
            fullWidth
            select
            name='stu_allocation_id'
            label = "Select Roll Number"
            value={formData.stu_allocation_id}
            onChange={handleChangeInput}
            error = {!!errors.stu_allocation_id}
            helperText = {errors.stu_allocation_id}
            >
                {studentsData.map((stu,index)=>(
                    <MenuItem key={index} value={stu.stu_allocation_id}>{stu.roll_no}</MenuItem>
                ))}
            </TextField>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={12}>
            <TextField
            fullWidth
            name='mark'
            label = "Please Enter Mark"
            value={formData.mark}
            onChange={handleChangeInput}
            error = {!!errors.mark}
            helperText = {errors.mark}
            />
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={12}>
            <TextField
            fullWidth
            select
            name='staff_id'
            label = "Staff Name"
            value={formData.staff_id}
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
    </div>


    {formData.staff_id && formData.sub_allocation_id && formData.exam_id && formData.academic_year && !formData.sub_exam_id ? (
    <ExamMasterMarkTable data={formData} />
) : formData.staff_id && formData.sub_allocation_id && formData.academic_year && formData.sub_exam_id ? (
    <SubExamMarkTable data={formData} />
) : (
    <h1 className='text-center'>Please Select Above fields to display Data</h1>
)}

    </>
  )
}

export default AddMark