import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, TextField } from '@mui/material';
import config from '../../../ApiConfig/config'
import ErrorDialog from '../../../ErrorHandler/ErrorDialog'

function AddStudents() {
  const [successMessage, setSuccessMessage] = useState('');
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErr,setOpenErr] = useState(false);
  const [errorMsg,setErrorMsg] = useState();
  const [officeStaffData,setOfficeStaffData] = useState([])
  const [clsData,setClsData] = useState([]);
  const [formData,setFormData] = useState({
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
  const [errors,setErrors] = useState({
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
    axios.get(`${config.apiurl}/staff/getOfficeAdmission`)
    .then((res)=>{
      setOfficeStaffData(res.data)
    })
    .catch((error)=>{
      console.log("Error :",error)
    })
  },[])

  useEffect(()=>{
    axios.get(`${config.apiurl}/class/getClass`)
    .then((res)=>{
      setClsData(res.data)
    })
    .catch((error)=>{
      console.log("Error :",error)
    })
  },[])
 
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
          errMsg = "Please Select one class"
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
        case "stu_img":
          if (!trimmedValue) {
            errMsg = "Student image is required";
          } else {
            const allowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'jfif', 'webp'];
            const extension = trimmedValue.name.split(".").pop().toLowerCase();
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


  const handleFileChange = (e) =>{
    const selectedFile = e.target.files[0];
    const error = handleValidation("stu_img",selectedFile);
    setErrors({...errors,stu_img : error});
    if(!error){
      setFormData({...formData,stu_img:selectedFile})
    }
  }

  const handleInputChange = (e) =>{
    const {name,value} = e.target;
    const error = handleValidation(name,value)
    setErrors({...errors,[name]:error})
    setFormData({...formData,[name]:value})
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    
    let formErrors = {};

    Object.keys(formData).forEach((name)=>{
      const value = formData[name];
      const error = handleValidation(name,value);
      if (error) {
        formErrors[name] = error;
      }
      
    })
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    axios.post(`${config.apiurl}/students/PostStudent`,formData,{
      headers:{'Content-Type' : 'multipart/form-data'}
    })
    .then((res)=>{
      setFormData({
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
      setSuccessMessage(res.data.message);
      setOpenSuccessDialog(true);
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
    
  }

  const handleClearData = () =>{
    setFormData({
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
    <div className='p-3'>
      <h1 className='text-center'>Add Student</h1>
      <Grid container spacing={3} className='mt-3' >
      <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = "stu_name"
          label = "Student Name"
          value = {formData.stu_name}
          onChange={handleInputChange}
          error = {!!errors.stu_name}
          helperText = {errors.stu_name}
          />
        </Grid>
      <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          select
          name = "cls_id"
          label = "Select Class"
          value = {formData.cls_id}
          onChange={handleInputChange}
          error = {!!errors.cls_id}
          helperText = {errors.cls_id}
          >
            {clsData.map((cls)=>(
              <MenuItem key={cls.cls_id} value={cls.cls_id}>{cls.cls_name}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item lg={6}  md={6} sm={6} xs={12} >
          <TextField
          fullWidth
          name = 'mobile'
          label = "Mobile"
          type='number'
          value = {formData.mobile}
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
          value = {formData.email}
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
          value = {formData.dob}
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
          value = {formData.blood_group}
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
                value={formData.gender}
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
          value = {formData.aadhar}
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
          value = {formData.address}
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
            value={formData.staff_id}
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
            <Button onClick={handleSubmit} variant='contained'>Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={handleClearData} className="btn bg-danger text-white">Clear</Button>
          </Grid>
      </Grid>

      <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />

      <Dialog open={openSuccessDialog} onClose={()=>setOpenSuccessDialog(false)}>
        <DialogTitle className='text-center bg-success text-white'>Success</DialogTitle>
        <DialogContent>
          <h1>{successMessage}</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AddStudents


