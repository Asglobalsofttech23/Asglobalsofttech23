import { Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config';
import moment from 'moment';

function AddStudentsAllocation() {
    const staff = sessionStorage.getItem('staff_id') , 
    cls = sessionStorage.getItem('cls_id'),
    sec = sessionStorage.getItem('sec_id')
    const [stu_data,setStu_data] = useState([])
    const [clsAndSecData,setClsAndSecData] = useState([])
    const [staffData,setStaffData] = useState([])
    const [formData, setFormData] = useState({
        stu_ids: [], // Initialize stu_ids as an empty array
        cls_id: cls || "",
        sec_id: sec || "",
        roll_no: [],
        academic_year: "",
        staff_id: staff || "",
    });
    
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
        case 'stu_ids':
            if (!value || value.length === 0) {
                errMsg = "At least one student must be selected";
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


   const handleStudentSelection = (studentId) => {
    // Reset the error message for student selection
    setErrors(prevErrors => ({
        ...prevErrors,
        stu_ids: "",
    }));

    // Update formData.stu_ids based on checkbox state
    if (formData.stu_ids.includes(studentId)) {
        setFormData(prevState => ({
            ...prevState,
            stu_ids: prevState.stu_ids.filter(id => id !== studentId)
        }));
    } else {
        setFormData(prevState => ({
            ...prevState,
            stu_ids: [...prevState.stu_ids, studentId]
        }));
    }
};


   const handleInputChange = (e) =>{
    const {name,value} = e.target;
    const error = handleValidation(name,value);
    setErrors({...errors,[name]:error})
    if(!error){
        setFormData({...formData,[name]:value})
    }
   }

   
   



   const cur_year = parseInt(moment().format('YYYY'));
    const pre_year = cur_year - 1
    const next_year = cur_year + 1 


//    const handleSubmit = (e) =>{
//     e.preventDefault()
//     let formErr = {}

//     Object.keys(formData).forEach((name)=>{
//         const value = formData[name];
//         const error = handleValidation(name,value);
//         if(error){
//             formErr[name] = error
//         }
//     })

//     if(Object.keys(formErr).length === 0){
//         // axios.post(`${config.apiurl}/students/postStudentAllocationData`,formData)
//         // .then((res)=>{
//         //     console.log("Data Added Successfully.",formData)
//         //     setFormData({
//         //         stu_id : [],
//         //         cls_id : "",
//         //         sec_id : "",
//         //         roll_no : "",
//         //         academic_year : "",
//         //         staff_id : "",
//         //     })
            
//         // })
//         // .catch((error)=>{
//         //     console.log("Error :",error)
//         // })
//         console.log(formData)
//     }else{
//         setErrors(formErr)
//     }


//    }


const handleSubmit = (e) => {
    e.preventDefault();
    let formErr = {};

    // Validate each form field
    Object.keys(formData).forEach((name) => {
        const value = formData[name];
        const error = handleValidation(name, value);
        if (error) {
            formErr[name] = error;
        }
    });

    // Check if roll_no is empty
    if (!formData.roll_no) {
        formErr['roll_no'] = "Roll Number is Required";
    }

    if (Object.keys(formErr).length === 0) {
        const startingRoll = formData.roll_no; 
        const newFormData = { ...formData };
        const rollNumbers = []; 
        for (let i = 0; i < newFormData.stu_ids.length; i++) {
            const inc = i+1;
            const rollNumber = startingRoll + inc;
            rollNumbers.push(rollNumber);
        }
        newFormData.roll_no = rollNumbers; 
        setFormData(newFormData);
        console.log("Form Data:", formData);
        console.log("New Form Data:", newFormData);
        // axios.post(`${config.apiurl}/students/postStudentAllocationData`,newFormData)
    } else {
        setErrors(formErr);
    }
};


const handleClear = () => {
    setFormData({
        stu_ids: [],
        cls_id: "",
        sec_id: "",
        roll_no: "",
        academic_year: "",
        staff_id: "",
    });
    setErrors({
        stu_ids: "",
        cls_id: "",
        sec_id: "",
        roll_no: "", // Clear the error message for roll_no
        academic_year: "",
        staff_id: "",
    });
};


  return (
    <>
    <h1 className='text-center mt-2'>Student Allocation</h1>
    <Grid spacing={3} container className='mt-2'>
    <Grid item lg={6} md={6} sm={6} xs={12}>
                    {stu_data.map((stu, index) => (
                        <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                    checked={formData.stu_ids.includes(stu.stu_id)}
                                    onChange={() => handleStudentSelection(stu.stu_id)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            }
                            label={stu.stu_name}
                        />
                        
                    ))}
                    {!!errors.stu_ids && (
                            <span style={{ color: 'red' }}>{errors.stu_ids}</span>
                        )}
                     
                </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Select Class"
            name = "cls_id"
            value = {formData.cls_id}
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
            value = {formData.sec_id}
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
        label="Roll Number"
        name="roll_no"
        value={formData.roll_no}
        onChange={handleInputChange}
        error={!!errors.roll_no}
        helperText={errors.roll_no} // Display the error message for roll_no
    />
</Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
            <TextField
            fullWidth
            select
            label = "Academic Year"
            name = "academic_year"
            value = {formData.academic_year}
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
            value = {formData.staff_id}
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
            <Button onClick={handleSubmit} variant='contained' style={{marginRight:'5px'}}>Submit</Button>
            <Button onClick={handleClear} style={{backgroundColor:'red',color:'white',marginLeft:'5px'}}>Clear</Button>
          
        </Grid>
    </Grid>
    </>
  )
}

export default AddStudentsAllocation