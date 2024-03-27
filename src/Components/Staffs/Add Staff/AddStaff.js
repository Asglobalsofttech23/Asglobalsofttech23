import axios from 'axios';
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Snackbar, TextField } from '@mui/material';
import ErrorDialog from '../../../ErrorHandler/ErrorDialog';

function AddStaff() {
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [deptData,setDeptData] = useState([]);
    const [roleData,setRoleData] = useState([]);
    const [openErr,setOpenErr] = useState(false);
    const [errorMsg,setErrorMsg] = useState()
    const [formData,setFormData] = useState({
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

    const [errors,setErrors] = useState({
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

    useEffect(()=>{
        axios.get(`${config.apiurl}/department/getDepartment`)
        .then((res) =>{
          // For when department change also clear role
          setFormData({...formData,role_id:''})
          
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
    },[formData.dept_id])

    useEffect(()=>{
        axios.get(`${config.apiurl}/role/getRoleByDepartment/${formData.dept_id}`)
        .then((res) =>{
            setRoleData(res.data)
        })
        .catch((error) => {
          // For when department change also clear role
          setFormData({...formData,role_id:''})
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
    },[formData.dept_id])

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
            case "staff_img":
          if (!trimmedValue) {
            errMsg = "Staff image is required";
          } else {
            const allowedExtensions = ['jpg', 'jpeg', 'gif', 'png', 'jfif', 'webp'];
            const extension = trimmedValue.name.split(".").pop().toLowerCase();
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
          setFormData({...formData,staff_img:selectedFile})
        }
      }

    const handleChangeInput = (e) =>{
        const {name,value} =e.target;
        const error = handleValidation(name,value);
        setErrors({...errors,[name]:error}) ;
        setFormData({...formData,[name]:value})
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        let formErr = {};

        Object.keys(formData).forEach((name)=>{
            const value = formData[name];
            const error = handleValidation(name,value);
            if(error){
                formErr[name] = error;
            }
        })

        if(Object.keys(formErr).length === 0){
            axios.post(`${config.apiurl}/staff/postStaff`,formData,{headers :{'Content-Type' : 'multipart/form-data'}})
            .then((res)=>{
              setFormData({
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
                setSuccessMessage(res.data.message);
               setOpenSuccessDialog(true);
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
      setFormData({
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
          value = {formData.staff_name}
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
          value = {formData.email}
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
          value = {formData.mobile}
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
                value={formData.gender}
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
          value = {formData.qualification}
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
          value = {formData.experience}
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
        value={formData.dept_id}
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
        value={formData.role_id}
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
          value = {formData.address}
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
      <Dialog open={openSuccessDialog} onClose={()=>setOpenSuccessDialog(false)}>
        <DialogTitle className='text-center bg-success text-white'>Success</DialogTitle>
        <DialogContent>
          <h1>{successMessage}</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>

      <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />
    </div>
  )
}

export default AddStaff
