import React, { useState,  useContext } from 'react'
import { BrowserRouter, Switch, Link, Route, useHistory } from 'react-router-dom'
import { Button, Input } from 'antd'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import "./AuthPage.scss"

export const AuthPage = () => {

    const { push } = useHistory();
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const changeHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }
    const registerHandler = async () => {
        try {
            await axios.post('/api/auth/registration', {...form}, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }) 
            push('/')
        } catch (error) {
            console.log(error) 
        }
    }
    const loginHandler = async () => {
        try {
            await axios.post('/api/auth/login', {...form}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                login(response.data.token, response.data.userId)
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <BrowserRouter>
            <Switch>
                <React.Fragment>
                    <div className="auth-page">
                        <Route path="/login">
                            <h1>Авторизация</h1>
                                <form onSubmit={(event) => event.preventDefault()}>
                                    <div className="email">
                                        <Input 
                                            type='email'
                                            name='email'
                                            placeholder="Email"
                                            onChange={changeHandler}
                                            className='validate'
                                        />
                                    </div>
                                    <div className='password'>
                                        <Input 
                                            type='password' 
                                            name='password' 
                                            placeholder="Password"
                                            onChange={changeHandler}
                                            className='validate'
                                        />
                                    </div>
                                    <div>
                                        <Button 
                                            type="primary"
                                            onClick={loginHandler}
                                        >
                                            Войти
                                        </Button>
                                        <Link to="/registration" className="btn-reg">Нет аккаунта?</Link>
                                    </div>
                                </form>
                        </Route> 
                        <Route path="/registration">
                            <h1>Регистрация</h1>
                            <form onSubmit={(event) => event.preventDefault()}>
                                <div className="email">
                                    <Input 
                                        placeholder="Email" 
                                        name='email'
                                        type='email'
                                        onChange={changeHandler}
                                        className='validate'
                                    />
                                </div>
                                <div className='password'>
                                    <Input 
                                        placeholder="Password" 
                                        name='password'
                                        type='password'
                                        onChange={changeHandler}
                                        className='validate'
                                    />
                                </div>
                                <div>
                                    <Button 
                                        type='primary'
                                        onClick={registerHandler}
                                    >
                                        Регистрация
                                    </Button>
                                    <Link to="/login" className="btn-reg">Уже есть аккаунт?</Link>
                                </div>
                            </form>
                        </Route> 
                    </div>
                </React.Fragment>
            </Switch>
        </BrowserRouter>
    )
}
