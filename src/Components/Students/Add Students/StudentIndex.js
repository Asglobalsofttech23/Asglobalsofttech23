import axios from 'axios'
import React, { useEffect, useState } from 'react'
import config from '../../../ApiConfig/config'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import * as XLSX from 'xlsx';
import UpdateStudents from './UpdateStudents';
import ErrorDialog from '../../../ErrorHandler/ErrorDialog'
import AddStudents from './AddStudents';
function StudentIndex() {
    const [successMessage, setSuccessMessage] = useState('');
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [studentsData,setStudentsData] = useState([]);
    const [dataPerPage,setDataPerPage] = useState(5);
    const [currentPage,setCurrentPage] = useState(1);
    const [searchedVal,setSearchedVal] = useState("");
    const [selectedStudents,setSelectedStudents] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openUpdate,setOpenUpdate] = useState(false);
    const [selectedstudentId,setSelectedStudentId] = useState([]);
    const [openErr,setOpenErr] = useState(false);
    const [errorMsg,setErrorMsg] = useState()
    const [dltOpen,setDltOpen] = useState(false);
    const [selectDataDlt,setSelectDataDlt] = useState()
    const [showNewStudents,setShowNewStudents] = useState(false)
    useEffect(()=>{
        axios.get(`${config.apiurl}/students/getStudents`)
        .then((res)=>{
            setStudentsData(res.data)
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            setErrorMsg(`Server error: ${error.response.status} - ${error.response.data.message}`);
            setOpenErr(true);
          } else if(error.request){
            setErrorMsg(`No response received from the server. Please wait a few minutes or inform your system administrator.`)
            setOpenErr(true)
           } else{
            setErrorMsg(`An unexpected error occurred. Please wait a few minutes or inform your system administrator.`);
           setOpenErr(true);
           }
        });
    },[openUpdate,dltOpen,showNewStudents])

    const handleDataChangePerPage = (e) =>{
        const newDataPerPage = parseInt(e.target.value,10)
        if(newDataPerPage === 0){
            setDataPerPage(studentsData.length);
            setCurrentPage(1);
        }else{
            setDataPerPage(newDataPerPage);
            setCurrentPage(1); 
        }
    }

    const lastIndexofData = currentPage * dataPerPage;
    const firstIndexofData = dataPerPage - lastIndexofData;
    const currentData = studentsData.slice(firstIndexofData,lastIndexofData)

    const filterData = (students) =>{
        const searchVal = searchedVal.toLocaleLowerCase();
        return(
            Object.values(students).some((value) =>value && value.toString().toLowerCase().includes(searchVal))
        )
    }

    const exportSingleData = (students) =>{
        const selectedStudentIds = [...selectedStudents];
        if(selectedStudentIds.includes(students)){
            const index = selectedStudentIds.indexOf(students);
            selectedStudentIds.splice(index,1)
        }else{
            selectedStudentIds.push(students)
        }
        setSelectedStudents(selectedStudentIds)

    }

    const exportAll = () =>{
        if(selectAll){
            setSelectedStudents([])
        }else{
            const allIds = studentsData.map((students)=>students.stu_id)
            setSelectedStudents(allIds)
        }
        setSelectAll(!selectAll)
    }

    const exportToCSV = () => {
    if (selectedStudents.length === 0) {
      console.log("No Students selected for export");
      return;
    }

    const selectedStudentData = studentsData.filter((students) =>
    selectedStudents.includes(students.stu_id)
    );

    // Create CSV content
    const header = Object.keys(selectedStudentData[0]).join(",");
    const csv = [
      header,
      ...selectedStudentData.map((students) =>
        Object.values(students)
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
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const selectedStudentData = studentsData.filter((students) =>
      selectedStudents.includes(students.stu_id)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedStudentData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  const exportToJSON = () => {
    const selectedStudentData = studentsData.filter((students) =>
      selectedStudents.includes(students.stu_id)
    );

    const jsonData = JSON.stringify(selectedStudentData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "students.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    if (selectedStudents.length === 0) {
      console.log("No Students selected for export");
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

  
  const handleUpdate = (stu_id) =>{
    
    const selectforUpdate = studentsData.find((students)=>students.stu_id === stu_id)
    if(selectforUpdate){
        setSelectedStudentId(selectforUpdate)
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

  const handleOpenDlt = (stu_id) =>{
    setSelectDataDlt(stu_id)
    setDltOpen(true)
  }

  const confirmDlt = () =>{
    if(selectDataDlt){
      axios.delete(`${config.apiurl}/students/delete/${selectDataDlt}`)
      .then((res)=>{
        setDltOpen(false)
      })
    }
  }


  return (
    <div className='p-3'>

      {showNewStudents ? (<><AddStudents/></>):(
      
      <>
      <h1 className='text-center'>Students Index</h1>
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
          <Button variant='contained' onClick={()=>setShowNewStudents(true)}>Add New Students</Button>
        </Grid>
        </Grid>
      <TableContainer component={Paper}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell><Checkbox checked={selectAll} onChange={exportAll}></Checkbox></TableCell>
                <TableCell>S.No</TableCell>
                <TableCell>Student Name</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date Of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Aadhar Number</TableCell>
                <TableCell>Student Image</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Registered Staff</TableCell>
                <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {currentData.filter(filterData).map((students,index) =>(
                    <TableRow key={students.stu_id}>
                        <TableCell><Checkbox
                        checked={selectedStudents.includes(students.stu_id)}
                        onChange={()=>exportSingleData(students.stu_id)}
                        ></Checkbox></TableCell>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{students.stu_name}</TableCell>
                        <TableCell>{students.mobile}</TableCell>
                        <TableCell>{students.email}</TableCell>
                        <TableCell>{students.dob}</TableCell>
                        <TableCell>{students.gender}</TableCell>
                        <TableCell>{students.blood_group}</TableCell>
                        <TableCell>{students.aadhar}</TableCell>
                        <TableCell>
                            <img  
                            src={`data:image/jpeg;base64,${students.stu_img}`} 
                            alt={students.stu_name}
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                        </TableCell>
                        <TableCell>{students.address}</TableCell>
                        <TableCell>{students.staff_name}</TableCell>
                        
                        <TableCell>
                          <Button onClick={()=>handleUpdate(students.stu_id)}>Edit</Button>
                          <Button onClick={()=>handleOpenDlt(students.stu_id)}>Delete</Button>
                          </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </TableContainer>


      <ErrorDialog open={openErr} onClose={()=>setOpenErr(false)} errorMessage={errorMsg} />

    <Dialog open={openUpdate} onClose={()=>setOpenUpdate(false)}>
      <DialogContent>
      <UpdateStudents data = {selectedstudentId} onClose={updateDialogClose}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpenUpdate(false)}>Close</Button>
      </DialogActions>
    </Dialog> 

    <Dialog open={openSuccessDialog} onClose={()=>setOpenSuccessDialog(false)}>
        <DialogTitle className='text-center bg-success text-white'>Success</DialogTitle>
        <DialogContent>
          <h1>{successMessage}</h1>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenSuccessDialog(false)}>OK</Button>
        </DialogActions>
      </Dialog>


    <Dialog open={dltOpen} onClose={()=>setDltOpen(false)}>
      <DialogContent>
      <p>Are you sure you want to delete this employee?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={confirmDlt} variant = 'contained' style={{backgroundColor: "#DC143C", color: "white"}}>Ok</Button>
        <Button onClick={()=>setDltOpen(false)} variant = 'contained' style={{ backgroundColor: "#1B9C85", color: "white"}}>Close</Button>
      </DialogActions>
    </Dialog> 

      </>)}



    </div>
  )
}

export default StudentIndex
