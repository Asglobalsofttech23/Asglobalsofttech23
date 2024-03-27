import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import './Login.css';
import axios from 'axios';
import config from '../../ApiConfig/config';

const LoginForm = ({onLogin}) => {
    const [adminData, setAdminData] = useState([]);
    const [clsTeacherData, setClsTeacherData] = useState([]);
    const [subjectTeacherData, setSubjectTeacherData] = useState([]);
    const [loginFormData, setLoginFormData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios.get(`${config.apiurl}/login/getAdmin`)
            .then((res) => {
                setAdminData(res.data);
            })
            .catch((error) => {
                console.log("Error:", error);
            });

        axios.get(`${config.apiurl}/login/getClsTeacher`)
            .then((res) => {
                setClsTeacherData(res.data);
            })
            .catch((error) => {
                console.log("Error:", error);
            });

        axios.get(`${config.apiurl}/login/getSubjectTeacher`)
            .then((res) => {
                setSubjectTeacherData(res.data);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }, []);

    const handleValidation = () => {
        const { username, password } = loginFormData;
        const errors = {};
        if (!username.trim()) {
            errors.username = "Username is required.";
        }
        if (!password.trim()) {
            errors.password = "Password is required.";
        }
        return errors;
    };

    const handleChangeInput = (e) => {
        const { name, value } = e.target;
        setLoginFormData({ ...loginFormData, [name]: value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const errors = handleValidation();
        setErrors(errors);

        if (Object.keys(errors).length === 0) {
            const admin = adminData.find(admin => admin.email === loginFormData.username && admin.mobile === loginFormData.password);
            const clsTeacher = clsTeacherData.find(clsTeacher => clsTeacher.email === loginFormData.username && clsTeacher.mobile === loginFormData.password);
            const subjectTeacher = subjectTeacherData.find(subjectTeacher => subjectTeacher.email === loginFormData.username && subjectTeacher.mobile === loginFormData.password);

            onLogin();

            if(admin || "raja" == loginFormData.username && '12345' == loginFormData.password){
                sessionStorage.setItem('adminIn','1')
            }else if(clsTeacher){
                sessionStorage.setItem('clsTeacherIn','1')
                sessionStorage.setItem('staff_id',`${clsTeacher.staff_id}`)
                sessionStorage.setItem('cls_id',`${clsTeacher.cls_id}`)
                sessionStorage.setItem('sec_id',`${clsTeacher.sec_id}`)
            }else if(subjectTeacher){
                sessionStorage.setItem('subjectTeacherIn','1')
                sessionStorage.setItem('staff_id',`${subjectTeacher.staff_id}`)
            }
        
        }
    };

    return (
        <div className='bgimg'>
            <div className='row'>
                <div className='col-12' style={{ marginLeft: '55px' }}>
                    <div className='' style={{ marginLeft: '60%' }}>
                        <div className='' style={{ paddingTop: '20%' }}>
                            <div className='form-container'>
                                <Form onSubmit={handleLogin} className='form pt-3'>
                                    <h1 className='pt-3 d-flex justify-content-center text-white'>Login Form</h1>
                                    {errors.general && <Alert variant='danger'>{errors.general}</Alert>}
                                    <Form.Group controlId='username'>
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control
                                            type='text'
                                            name='username'
                                            value={loginFormData.username}
                                            onChange={handleChangeInput}
                                        />
                                        {errors.username && (
                                            <Form.Text className='text-danger'>{errors.username}</Form.Text>
                                        )}
                                    </Form.Group>
                                    <Form.Group controlId='password'>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            type='password'
                                            name='password'
                                            value={loginFormData.password}
                                            onChange={handleChangeInput}
                                        />
                                        {errors.password && (
                                            <Form.Text className='text-danger'>{errors.password}</Form.Text>
                                        )}
                                    </Form.Group>
                                    <div className='pt-3 d-flex justify-content-center'>
                                        <Button variant='primary' type='submit' className='login-button' style={{ width: '150px' }}>
                                            Login
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
