import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AddStudents from './Components/Students/Add Students/AddStudents';
import StudentIndex from './Components/Students/Add Students/StudentIndex';
import 'bootstrap/dist/css/bootstrap.css';
import AddStaff from './Components/Staffs/Add Staff/AddStaff';
import StaffIndex from './Components/Staffs/Add Staff/StaffIndex';
import StaffAllocation from './Components/Staffs/Staff Allocation/StaffAllocation';
import StaffsTopBar from './Components/Navbar/Staffs/StaffTopBar/StaffsTopBar';
import Login from './Components/Login/LoginForm';
import AddStudentsAllocation from './Components/Students/Students Allocation/AddStudentsAllocation';
import StudentAllocationTable from './Components/Students/Students Allocation/StudentAllocationTable';
import AddMark from './Components/Marks/SubjectTeacher/AddMark';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminIn,setAdminIn] = useState(false);
  const [clsTeacherIn,setClsTeacherIn] = useState(false);
  const [subjectTeacherIn,setSubjectTeacherIn] = useState(false)



  useEffect(()=>{
    if(sessionStorage.getItem('adminIn') === '1'){
      setAdminIn(true)
    }else if(sessionStorage.getItem('clsTeacherIn') === '1'){
      setClsTeacherIn(true)
    }else if(sessionStorage.getItem('subjectTeacherIn') === '1'){
      setSubjectTeacherIn(true)
    }
  },[loggedIn])
  

  return (
    <div className='App'>
      <BrowserRouter>
        <StaffsTopBar />
        <Routes>

        <Route path="/login" element={<Login onLogin={() => setLoggedIn(true)}/>} />
          {adminIn ? (<Route path="/" element={<StudentIndex />} />) :
            clsTeacherIn ? (<Route path="/" element={<StaffIndex />} />) :
              subjectTeacherIn ? (<Route path="/" element={<StaffAllocation />} />) :
                (<Route path="/" element={<Login onLogin={() => setLoggedIn(true)}/>} />)
          }

          {adminIn ? (
            <>
            <Route path="/studentindex" element={<StudentIndex />} />
          <Route path="/staffindex" element={<StaffIndex />} />
          <Route path="/staffAllocation" element={<StaffAllocation />} />
            </>
          ) : (<></>)}

          {clsTeacherIn ? (
            <>
            <Route path="/studentindex" element={<StudentIndex />} />
            <Route path="/studentallocation" element={<AddStudentsAllocation/>} />
            <Route path="/studentallocationindex" element={<StudentAllocationTable/>} />
            <Route path="/addmark" element={<AddMark/>} />
            </>
          ) : (<></>)}


          {subjectTeacherIn ? (<>
            <Route path="/addmark" element={<AddMark/>} />
          </>) : (<></>)}

         

          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
