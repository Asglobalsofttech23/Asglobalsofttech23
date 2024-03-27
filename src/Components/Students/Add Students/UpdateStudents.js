import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../../ApiConfig/config';
import ErrorDialog from '../../../ErrorHandler/ErrorDialog';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';

function UpdateStudents({ data ,onClose}) {
  const [clsData, setClsData] = useState([]);
  const [secData, setSecData] = useState([]);
  const [openErr,setOpenErr] = useState(false);
  const [errorMsg,setErrorMsg] = useState()
  const [officeStaffData,setOfficeStaffData] = useState([])
  const [updateData, setUpdateData] = useState({
    staff_id: data ? data.staff_id : '', 
    cls_id: data ? data.cls_id : '', 
    stu_name: data ? data.stu_name : '', 
    mobile: data ? data.mobile : '', 
    email: data ? data.email : '', 
    dob: data ? data.dob : '', 
    gender: data ? data.gender : '', 
    blood_group: data ? data.blood_group : '', 
    aadhar: data ? data.aadhar : '', 
    stu_img: data ? data.stu_img : '', 
    address: data ? data.address : '', 
    
  });

  const [errors, setErrors] = useState({
    staff_id : '',
    cls_id : '',
    stu_name : '',
    mobile : '',
    email : '',
    dob : '',
    gender : '',
    blood_group : '',
    aadhar : '',
    stu_img : '',
    address : ''
  });

  useEffect(()=>{
    axios.get(`${config.apiurl}/class/getClass`)
    .then((res)=>{
      setClsData(res.data)
    })
    .catch((error)=>{
      console.log("Error :",error)
    })
  })

  useEffect(()=>{
    axios.get(`${config.apiurl}/staff/getOfficeAdmission`)
    .then((res)=>{
      setOfficeStaffData(res.data)
    })
    .catch((error)=>{
      console.log("Error :",error)
    })
  })

  const handleValidation = (name,value) =>{
    let errMsg = '';
    const trimmedValue = value && typeof value === 'string' ? value.trim() : value ;
    switch (name) {
      case "staff_id" :
        if(!trimmedValue){
          errMsg = "Please Select one staff"
        }
        break;
      case "cls_id" :
        if(!trimmedValue){
          errMsg = "Please Select Class"
        }
        break;
      case "stu_name" :
        if(!trimmedValue){
          errMsg = "Student Name is Required."
        }
        break;
      case "mobile":
        if(!trimmedValue){
          errMsg = "Mobile Number is Required"
        }else if (!/^\d{10}$/.test(trimmedValue)) {
          errMsg = "Enter a valid Mobile Number"
        }
        break;
        case "email":
        if(!trimmedValue){
          errMsg = "Email is Required."
        }
        break;
        case "dob":
        if(!trimmedValue){
          errMsg = "Date of birth is Required."
        }
        break;
        case "gender":
        if(!trimmedValue){
          errMsg = "Gender is Required."
        }
        break;
        case "blood_group":
        if(!trimmedValue){
          errMsg = "Blood Group is Required."
        }
        break;
        case "aadhar":
        if(!trimmedValue){
          errMsg = "Aadhar Number is Required."
        }
        break;
        case 'stu_img':
  if (value && value.name) {
    const allowedExtensions = ["jpg", "jpeg", "gif", "png", "jfif", "webp"];
    const extension = value.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errMsg = "Please upload a valid image file (jpg, jpeg, png, gif, webp, jfif)";
    }
  }
  break;
          case "address":
        if(!trimmedValue){
          errMsg = "Address is Required."
        }
        break;
        default:
          break;
    }
    return errMsg
  }


  
  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = handleValidation(name, value);
    setErrors({ ...errors, [name]: error });
    setUpdateData({ ...updateData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const error = handleValidation('stu_img', selectedFile);
    setErrors({ ...errors, stu_img: error });
    setUpdateData({ ...updateData, stu_img: selectedFile });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let formError = {};

    Object.keys(updateData).forEach((name) => {
      const value = updateData[name];
      const error = handleValidation(name, value);
      if (error) {
        formError[name] = error;
      }
    });
    if (Object.keys(formError).length === 0) {
      // Proceed with the update as there are no validation errors
      axios.put(`${config.apiurl}/students/update/${data.stu_id}`, updateData,{headers : {'Content-Type' : 'multipart/form-data'}})
      .then((res)=>{

        setUpdateData({
        staff_id : '',
        cls_id : '',
        stu_name : '',
        mobile : '',
        email : '',
        dob : '',
        gender : '',
        blood_group : '',
        aadhar : '',
        stu_img : '',
        address : ''
        })
        onClose(res.data.result)
        
      })
      .catch((error) => {
        if (error.response) {
          setErrorMsg(`Server Error: ${error.response.status} - ${error.response.data.message}`);
          setOpenErr(true);
        } else if (error.request) {
          setErrorMsg(`No response received from the server. Please wait a few minutes or inform your system administrator.`);
          setOpenErr(true);
        } else {
          setErrorMsg(`An unexpected error occurred. Please wait a few minutes or inform your system administrator.`);
          setOpenErr(true);
        }
      })
      
    } else {
      // Validation errors exist, update the state to show errors
      setErrors(formError);
    }
  };
  
  const handleClearData = () =>{
    setUpdateData({
    staff_id : '',
    cls_id : '',
    stu_name : '',
    mobile : '',
    email : '',
    dob : '',
    gender : '',
    blood_group : '',
    aadhar : '',
    stu_img : '',
    address : ''
    })
    setErrors({
    staff_id : '',
    cls_id : '',
    stu_name : '',
    mobile : '',
    email : '',
    dob : '',
    gender : '',
    blood_group : '',
    aadhar : '',
    stu_img : '',
    address : ''
    })
  }
  
  return (
    <div>
      <Grid container spacing={3} className='mt-3' >
      <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = "stu_name"
          label = "Student Name"
          value = {updateData.stu_name}
          onChange={handleInputChange}
          error = {!!errors.stu_name}
          helperText = {errors.stu_name}
          />
        </Grid>
        {/* <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          select
          name = "cls_id"
          label = "Select Class"
          value = {updateData.cls_id}
          onChange={handleInputChange}
          error = {!!errors.cls_id}
          helperText = {errors.cls_id}
          >
            {clsData.map((cls)=>(
              <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
            ))}
          </TextField>
        </Grid> */}
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'mobile'
          label = "Mobile"
          type='number'
          value = {updateData.mobile}
          onChange={handleInputChange}
          error = {!!errors.mobile}
          helperText = {errors.mobile}
          />
          </Grid>
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'email'
          label = "Email"
          value = {updateData.email}
          onChange={handleInputChange}
          error = {!!errors.email}
          helperText = {errors.email}
          />
          </Grid>
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'dob'
          type='date'
          InputLabelProps={{
            shrink: true,
        }}
          label = 'Date Of Birth'
          value = {updateData.dob}
          onChange={handleInputChange}
          error = {!!errors.dob}
          helperText = {errors.dob}
          />
        </Grid>
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'blood_group'
          label = "Blood Group"
          value = {updateData.blood_group}
          onChange={handleInputChange}
          error = {!!errors.blood_group}
          helperText = {errors.blood_group}
          />
          </Grid>
        <Grid item lg={6}  md={6} sm={6} xs={12} >
        <FormControl component="fieldset" error={!!errors.gender}>
              <FormLabel id="demo-row-radio-buttons-group-label" >
                Gender
              </FormLabel>
              <RadioGroup
                row
                name = "gender"
                value={updateData.gender}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
              <div style={{ color: 'red' }}>{errors.gender}</div>
            </FormControl>
        </Grid>
        
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'aadhar'
          label = "Aadhar Number"
          type='number'
          value = {updateData.aadhar}
          onChange={handleInputChange}
          error = {!!errors.aadhar}
          helperText = {errors.aadhar}
          />
          </Grid>
          <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'stu_img'
          label = "Student Image"
          type='file'
          onChange={handleFileChange}
          InputLabelProps = {{shrink:true}}
          error = {!!errors.stu_img}
          helperText = {errors.stu_img}
          />
          </Grid>
          <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'address'
          label = "Address"
          value = {updateData.address}
          onChange={handleInputChange}
          error = {!!errors.address}
          helperText = {errors.address}
          />
          </Grid>
          
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
            select
            fullWidth
            name='staff_id'
            label='Select Staff'
            onChange={handleInputChange}
            value={updateData.staff_id}
            error = {!!errors.staff_id}
          helperText = {errors.staff_id}
          >
            {officeStaffData.map((staff) => (
              <MenuItem key={staff.staff_id} value={staff.staff_id}>
                {staff.staff_name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
          <Grid item lg={12} xs={12} md={12} sm={12} style={{display:'flex',justifyContent:'center'}} >
            <Button onClick={handleUpdate} variant='contained'>Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={handleClearData} className="btn bg-danger text-white">Clear</Button>
          </Grid>
      </Grid>


      <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />
      
    </div>
  );
}

export default UpdateStudents;
