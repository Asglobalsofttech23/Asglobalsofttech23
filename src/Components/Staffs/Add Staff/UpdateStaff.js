import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../../../ApiConfig/config";
import { trim } from "validator";
import ErrorDialog from "../../../ErrorHandler/ErrorDialog";

function UpdateStaff({ data, onClose }) {
  const [deptData, setDeptData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [openErr, setOpenErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [updateData, setUpdateData] = useState({
    dept_id: data ? data.dept_id : "",
    role_id: data ? data.role_id : "",
    staff_name: data ? data.staff_name : "",
    email: data ? data.email : "",
    mobile: data ? data.mobile : "",
    gender: data ? data.gender : "",
    qualification: data ? data.qualification : "",
    experience: data ? data.experience : "",
    address: data ? data.address : "",
    staff_img: data ? data.staff_img : "",
  });
  const [errors, setErrors] = useState({
    dept_id: "",
    role_id: "",
    staff_name: "",
    email: "",
    mobile: "",
    gender: "",
    qualification: "",
    experience: "",
    address: "",
    staff_img: "",
  });

  useEffect(() => {
    // For when department change also clear role
    if (data.dept_id !== updateData.dept_id) {
      setUpdateData({ ...updateData, role_id: '' });
    }
  }, [updateData.dept_id, data.dept_id]);
  

  useEffect(()=>{
    axios.get(`${config.apiurl}/department/getDepartment`)
    .then((res) =>{
        setDeptData(res.data)

       
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
},[])

useEffect(()=>{
    axios.get(`${config.apiurl}/role/getRoleByDepartment/${updateData.dept_id}`)
    .then((res) =>{
        setRoleData(res.data)
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
},[updateData.dept_id])

const handleValidation = (name,value) =>{
    let errMsg = "";
    const trimmedValue = value && typeof value  === "string" ? value.trim() : value;

    switch (name){
        case "dept_id":
            if(!trimmedValue){
                errMsg = "Department is Required"
            }
        break;
        case "role_id":
            if(!trimmedValue){
                errMsg = "Role is Required"
            }
        break;
        case "staff_name":
            if(!trimmedValue){
                errMsg = "Staff Name is Required" 
            }
        break;
        case "email":
            if(!trimmedValue){
                errMsg = "Staff Email is Required"
            }
        break;
        case "mobile":
            if(!trimmedValue){
                errMsg = "Staff Mobile Number is Required"
            }else if (!/^\d{10}$/.test(trimmedValue)) {
                errMsg = "Enter a valid Mobile Number"
              }
        break;
        case "gender":
            if(!trimmedValue){
                errMsg = "Gender  is Required"
            }
        break;
        case "qualification":
            if(!trimmedValue){
                errMsg = "Qualification  is Required"
            }
        break;
        case "experience":
            if(!trimmedValue){
                errMsg = "Experience  is Required"
            }
        break;
        case "address":
            if(!trimmedValue){
                errMsg = "Address  is Required"
            }
        break;
        case 'staff_img':
  if (value && value.name) {
    const allowedExtensions = ["jpg", "jpeg", "gif", "png", "jfif", "webp"];
    const extension = value.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      errMsg = "Please upload a valid image file (jpg, jpeg, png, gif, webp, jfif)";
    }
  }
  break;
        default : 
        break

    }
    return errMsg;
}

const handleFileChange = (e) =>{
    const selectedFile = e.target.files[0];
    const error = handleValidation("staff_img",selectedFile);
    setErrors({...errors,staff_img : error});
    if(!error){
      setUpdateData({...updateData,staff_img:selectedFile})
    }
  }

const handleChangeInput = (e) =>{
    const {name,value} =e.target;
    const error = handleValidation(name,value);
    setErrors({...errors,[name]:error}) ;
    setUpdateData({...updateData,[name]:value})
}

const handleSubmit = (e) =>{
    e.preventDefault();

    let formErr = {};

    Object.keys(updateData).forEach((name)=>{
        const value = updateData[name];
        const error = handleValidation(name,value);
        if(error){
            formErr[name] = error;
        }
    })

    if(Object.keys(formErr).length === 0){
        axios.put(`${config.apiurl}/staff/update/${data.staff_id}`,updateData,{headers :{'Content-Type' : 'multipart/form-data'}})
        .then((res)=>{
          setUpdateData({
            dept_id : "",
            role_id : "",
            staff_name : "",
            email : "",
            mobile : "",
            gender : "",
            qualification : "",
            experience : "",
            address : "",
            staff_img : ""
          })
        })
        .catch((error) => {
            if (error.response) {
              setErrorMsg(`Server Error: ${error.response.status} - ${error.response.message}`);
              setOpenErr(true);
            } else if (error.request) {
              setErrorMsg(`No response received from the server. Please wait a few minutes or inform your system administrator.`);
              setOpenErr(true);
            } else {
              setErrorMsg(`An unexpected error occurred. Please wait a few minutes or inform your system administrator.`);
              setOpenErr(true);
            }
          })
    }else{
        setErrors(formErr)
    }
}

const handleClearData = () =>{
  setUpdateData({
    dept_id : "",
    role_id : "",
    staff_name : "",
    email : "",
    mobile : "",
    gender : "",
    qualification : "",
    experience : "",
    address : "",
    staff_img : ""
  });
  setErrors({
    dept_id : "",
    role_id : "",
    staff_name : "",
    email : "",
    mobile : "",
    gender : "",
    qualification : "",
    experience : "",
    address : "",
    staff_img : ""
  })
}

return (
<div className='p-3'>
  <Grid container spacing={3}>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "staff_name"
      label = "Staff Name"
      value = {updateData.staff_name}
      onChange={handleChangeInput}
      error = {!!errors.staff_name}
      helperText = {errors.staff_name}
      />
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "email"
      label = "Staff Email"
      value = {updateData.email}
      onChange={handleChangeInput}
      error = {!!errors.email}
      helperText = {errors.email}
      />
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "mobile"
      label = "Mobile Number"
      value = {updateData.mobile}
      onChange={handleChangeInput}
      error = {!!errors.mobile}
      helperText = {errors.mobile}
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
            onChange={handleChangeInput}
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
      name = "qualification"
      label = "Qualification"
      value = {updateData.qualification}
      onChange={handleChangeInput}
      error = {!!errors.qualification}
      helperText = {errors.qualification}
      />
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "experience"
      label = "Experience"
      value = {updateData.experience}
      onChange={handleChangeInput}
      error = {!!errors.experience}
      helperText = {errors.experience}
      />
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
    <TextField
    select
    fullWidth
    name='dept_id'
    label = 'Select Department'
    value={updateData.dept_id}
    onChange={handleChangeInput}
    error = {!!errors.dept_id}
    helperText = {errors.dept_id}
    >
        {deptData.map((dept)=>(
            <MenuItem key={dept.dept_id} value={dept.dept_id}>{dept.dept_name}</MenuItem>
        ))}
    </TextField>
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
    <TextField
    select
    fullWidth
    name = 'role_id'
    label = 'Select Role'
    value={updateData.role_id}
    onChange={handleChangeInput}
    error = {!!errors.role_id}
    helperText = {errors.role_id}
    >
        {roleData.map((role)=>(
            <MenuItem key={role.role_id} value={role.role_id}>{role.role_name}</MenuItem>
        ))}
    </TextField>
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "address"
      label = "Adress"
      value = {updateData.address}
      onChange={handleChangeInput}
      error = {!!errors.address}
      helperText = {errors.address}
      />
  </Grid>
  <Grid item lg={6}  md={6} sm={6} xs={12} >
  <TextField
      fullWidth
      name = "staff_img"
      label = "Staff Image"
      type='file'
      onChange={handleFileChange}
      InputLabelProps = {{shrink:true}}
      error = {!!errors.staff_img}
      helperText = {errors.staff_img}
      />
  </Grid>
  <Grid item lg={12} xs={12} md={12} sm={12} style={{display:'flex',justifyContent:'center'}} >
        <Button onClick={handleSubmit} variant='contained'>Submit</Button>&nbsp;&nbsp;&nbsp;&nbsp;
        <Button onClick={handleClearData} className='btn bg-danger text-white'>Clear</Button>
      </Grid>
  </Grid>
  

  <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />
</div>
)
}


export default UpdateStaff;
