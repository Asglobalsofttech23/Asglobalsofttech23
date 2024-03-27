import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config'
import ErrorDialog from '../../../ErrorHandler/ErrorDialog';
import { Checkbox, FormControl, Grid, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import * as XLSX from 'xlsx'
import UpdateStaff from './UpdateStaff';
import AddStaff from './AddStaff';

function StaffIndex() {
    const [staffData,setStaffData] = useState([]);
    const [openErr,setOpenErr] = useState(false);
    const [errorMsg,setErrorMsg] = useState();
    const [dataPerPage,setDataPerPage] = useState(5);
    const [currentPage,setCurrentPage] = useState(1);
    const [searchedVal,setSearchedVal] = useState("");
    const [anchorEl,setAnchorEl] = useState(null);
    const [selectedStaffs,setSelectedStaffs] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [selectDataUpdate,setSelectDataUpdate] = useState();
    const [openUpdate,setOpenUpdate] = useState(false)
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [selectDataDlt,setSelectDataDlt] = useState();
    const [openDlt,setOpenDlt] = useState(false);
    const [showNewStaff,setShowNewStaff] = useState(false);
    const [openResign,setOpenResign] = useState(false);
    const [resignData,setResignData] = useState({
      staff_id : '',
      reason : ''
    })
    useEffect(()=>{
        axios.get(`${config.apiurl}/staff/getStaff`)
        .then((res)=>{
            setStaffData(res.data) 
        }).catch((error)=>{
            if(error.response){
                setErrorMsg(`Server error : ${error.response.status} - ${error.message}`) ;
                console.log("Errror :",error)
                setOpenErr(true)
            }else if(error.request){
                setErrorMsg(`No response received from the server. Please wait a few minutes or inform your system administrator.`)
                setOpenErr(true)
               } else{
                setErrorMsg(`An unexpected error occurred. Please wait a few minutes or inform your system administrator.`);
               setOpenErr(true);
               }
        })
    },[openUpdate,openResign])

    const handleDataChangePerPage = (e) =>{
        const newDataPerPage = parseInt(e.target.value,10);
        if(newDataPerPage === 0){
            setDataPerPage(staffData.length);
            setCurrentPage(1)
        }else{
            setDataPerPage(newDataPerPage);
            setCurrentPage(1)
        }
    }

    const lastIndexofData = currentPage * dataPerPage;
    const firstIndexofData = dataPerPage - lastIndexofData;
    const currentData = staffData.slice(firstIndexofData,lastIndexofData);

    const filterData = (staff) =>{
        const searchVal = searchedVal.toLocaleLowerCase();
        return(
            Object.values(staff).some((value) => value && value.toString().toLowerCase().includes(searchVal))
        )

    }

    const exportSingleData = (staff) =>{
        const selectedStaffIds = [...selectedStaffs];
        if(selectedStaffIds.includes(staff)){
            const index = selectedStaffIds.indexOf(staff);
            selectedStaffIds.splice(index,1)
        }else{
            selectedStaffIds.push(staff)
        }
        setSelectedStaffs(selectedStaffIds)

    }

    const exportAll = () =>{
        if(selectAll){
            setSelectedStaffs([])
        }else{
            const allIds = staffData.map((staff)=>staff.staff_id)
            setSelectedStaffs(allIds)
        }
        setSelectAll(!selectAll)
    }


    const exportToCSV = () => {
        if (selectedStaffs.length === 0) {
          console.log("No Staff selected for export");
          return;
        }
    
        const selectedStaffData = staffData.filter((staff) => selectedStaffs.includes(staff.staff_id));
    
        // Create CSV content
        const header = Object.keys(selectedStaffData[0]).join(",");
        const csv = [
          header,
          ...selectedStaffData.map((staff) =>
            Object.values(staff)
              .map((value) => `"${value}"`)
              .join(",")
          ),
        ].join("\n");
    
        // Create Blob for CSV file
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
    
        // Download CSV file
        const a = document.createElement("a");
        a.href = url;
        a.download = "staff.csv";
        a.click();
        URL.revokeObjectURL(url);
      };


      const exportToExcel = () => {
        const selectedStaffData = staffData.filter((staff)=>selectedStaffs.includes(staff.staff_id));
        const worksheet = XLSX.utils.json_to_sheet(selectedStaffData);
    
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
        XLSX.writeFile(workbook, "staff.xlsx");
      };
    
      const exportToJSON = () => {
        const selectedStaffData = staffData.filter((staff)=>selectedStaffs.includes(staff.staff_id));
    
        const jsonData = JSON.stringify(selectedStaffData, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement("a");
        a.href = url;
        a.download = "staff.json";
        a.click();
        URL.revokeObjectURL(url);
      };

      const handleExport = (format) => {
        if (selectedStaffs.length === 0) {
          console.log("No Staff selected for export");
          return;
        }
    
        switch (format) {
          case "CSV":
            exportToCSV();
            break;
          case "Excel":
            exportToExcel();
            break;
          case "JSON":
            exportToJSON();
            break;
          default:
            break;
        }
      };


      const handleUpdate = (staff_id) =>{
        const selectedData = staffData.find((staff)=>staff.staff_id === staff_id);
        if(selectedData){
          setSelectDataUpdate(selectedData);
          setOpenUpdate(true)
        }
      }

      const updateDialogClose = (successMsg) =>{
        setOpenUpdate(false)
        if (successMsg) {
          setSuccessMessage(successMsg);
          setOpenSuccessDialog(true);
        }
      }

      const handleDlt = (staff_id) =>{
        if(staff_id){
          setSelectDataDlt(staff_id);
          setOpenDlt(true)
        }
      }

      const confirmDlt =() =>{
        if(selectDataDlt){
          axios.delete(`${config.apiurl}/staff/delete/${selectDataDlt}`)
          .then((res)=>{
            setOpenDlt(false)
            setSuccessMessage(res.data.message);
           setOpenSuccessDialog(true);

          })
        }
        
      }


      const handleResignStaff = (staff_id) =>{
        if(staff_id){
          setResignData({...resignData,staff_id:staff_id})
          setOpenResign(true)
        }
      }

      const confirmResign = () =>{
        if(resignData.staff_id && resignData.reason){
          axios.post(`${config.apiurl}/staff/resign`,resignData)
          .then((res)=>{
            setSuccessMessage(res.data.message);
           setOpenSuccessDialog(true);
          })
        }
      }
    

  return (
    <div>
      {showNewStaff ? (<><AddStaff/></>) :(
      
      <>
      <h1 className='text-center'>Staff Index</h1>
        <Grid container spacing={3}>
        <Grid item lg={3}  md={3} sm={3} xs={12} >
            <Button onClick={(e)=>setAnchorEl(e.currentTarget)}>
            Export data
            </Button>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleExport("CSV")}>
              Export as CSV
            </MenuItem>
            <MenuItem onClick={() => handleExport("Excel")}>
              Export as Excel
            </MenuItem>
            <MenuItem onClick={() => handleExport("JSON")}>
              Export as JSON
            </MenuItem>
          </Menu>
        </Grid>
        <Grid item lg={3}  md={3} sm={3} xs={12} >
            <TextField label="Search" onChange={(e)=>setSearchedVal(e.target.value)}/>
        </Grid>
        <Grid item lg={3}  md={3} sm={3} xs={12} >
        <FormControl>
        <Select
          value={dataPerPage}
          onChange={handleDataChangePerPage}
        >
          <MenuItem value={5}>5 Per Page</MenuItem>
          <MenuItem value={10}>10 Per Page</MenuItem>
          <MenuItem value={15}>15 Per Page</MenuItem>
          <MenuItem value={0}>All Per Page</MenuItem>
        </Select>
      </FormControl>
        </Grid>
        <Grid item lg={3}  md={3} sm={3} xs={12} >
          <Button variant='contained' onClick={()=>setShowNewStaff(true)}>Add New Staff</Button>
        </Grid>
        </Grid>

        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell><Checkbox checked={selectAll} onChange={exportAll}></Checkbox></TableCell>
                    <TableCell>S.no</TableCell>
                    <TableCell>Staff Name</TableCell>
                    <TableCell>Staff Email</TableCell>
                    <TableCell>Mobile Number</TableCell>
                    <TableCell>Gender</TableCell>
                    <TableCell>Qualification</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Staff Image</TableCell>
                    <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentData.filter(filterData).map((staff,index)=>(
                        <TableRow key={staff.staff_id}>
                            <TableCell>
                                <Checkbox checked={selectedStaffs.includes(staff.staff_id)} 
                                onChange={()=>exportSingleData(staff.staff_id)}>
                                </Checkbox>
                            </TableCell>
                            <TableCell>{index+1}</TableCell>
                            <TableCell>{staff.staff_name}</TableCell>
                            <TableCell>{staff.email}</TableCell>
                            <TableCell>{staff.mobile}</TableCell>
                            <TableCell>{staff.gender}</TableCell>
                            <TableCell>{staff.qualification}</TableCell>
                            <TableCell>{staff.experience}</TableCell>
                            <TableCell>{staff.dept_name}</TableCell>
                            <TableCell>{staff.role_name}</TableCell>
                            <TableCell>{staff.address}</TableCell>
                            <TableCell>
                                <img 
                                src={`data:image/jpeg;base64,${staff.staff_img}`}
                                alt={staff.staff_name}
                                style={{ maxWidth: "100px", maxHeight: "100px" }}
                                />
                            </TableCell>
                            <TableCell>
                              <Button onClick={()=>handleUpdate(staff.staff_id)}>Edit</Button>
                              <Button onClick={()=>handleDlt(staff.staff_id)}>Delete</Button>
                              <Button onClick={()=>handleResignStaff(staff.staff_id)}>Desiable</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
      
      <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />

      <Dialog open={openUpdate} onClose={()=>setOpenUpdate(false)} maxWidth='md'>
        <DialogTitle className='text-center bg-primary text-white'>Update Data</DialogTitle>
        <DialogContent ><UpdateStaff data={selectDataUpdate} onClose={updateDialogClose}/></DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenUpdate(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDlt} onClose={()=>setOpenDlt(false)} maxWidth='md'>
        {/* <DialogTitle className='text-center bg-primary text-white'>Confirmation</DialogTitle> */}
        <DialogContent >
        <p>Are you sure you want to delete this employee?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmDlt} variant = 'contained' style={{backgroundColor: "#DC143C", color: "white"}}>Ok</Button>
          <Button onClick={()=>setOpenUpdate(false)} variant = 'contained' style={{ backgroundColor: "#1B9C85", color: "white"}}>Close</Button>
        </DialogActions>
      </Dialog>

      

      <Dialog open={openResign} onClose={()=>setOpenResign(false)} maxWidth='lg'>
        <DialogTitle className='text-center bg-success text-white'>Reason For Resign</DialogTitle>
        <DialogContent className='mt-3'>
          <TextField label="Reason" fullWidth onChange={(e)=>setResignData({...resignData,reason:e.target.value})}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmResign}>OK</Button>
          <Button onClick={()=>setOpenResign(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>


      <Dialog open={openSuccessDialog} onClose={()=>setOpenSuccessDialog(false)} maxWidth='md'>
        <DialogTitle className='text-center bg-success text-white'>Success</DialogTitle>
        <DialogContent>
          <h1>{successMessage}</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>
      </>)}
    </div>
  )
}

export default StaffIndex
