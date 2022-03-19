import React, { useState, useContext, useCallback, useEffect } from 'react'
import { Button, Input } from 'antd'
import { CheckOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons'
import axios from 'axios'
import { AuthContext } from '../../context/AuthContext'
import './MainPage.scss'

export const MainPage = () => {
    const [ text, setText ] = useState('')
    const [ todos, setTodos] = useState([])
    const { userId } = useContext(AuthContext)

    const getTodos = useCallback(async () => {
        try {
            await axios.get('/api/todo', {
                headers: {
                    'Content-Type': 'application/json'
                },
                params: { userId }
            })
            .then((response) => {
                setTodos(response.data)
            })
        } catch (error) {
            console.log(error)
        }
    },[userId, setTodos])

    const createTodo = useCallback(async () => {
        if(!text) return null
        try {
            await axios.post('/api/todo/add', { text, userId },{
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setTodos([...todos], response.data)
                setText('')
                getTodos()
            })
        } catch (error) {
            console.log(error)
        }
    }, [text, userId, todos, getTodos])

    const deleteTodo = useCallback(async (id) => {
        try {
            await axios.delete(`/api/todo/delete/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => getTodos())
        } catch (error) {
            console.log(error)
        }
    }, [getTodos])

    const completedTodo = useCallback( async (id) => {
        try {
            await axios.put(`/api/todo/complete/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setTodos([...todos], response.data)
                getTodos()
            })
        } catch (error) {
            console.log(error)
        }
    }, [todos, getTodos])

    const importantTodo = useCallback( async (id) => {
        try {
            await axios.put(`/api/todo/important/${id}`, {id}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                setTodos([...todos], response.data)
                getTodos()
            })
        } catch (error) {
            console.log(error)
        }
    }, [todos, getTodos])

    useEffect(() => {
        getTodos()
    }, [getTodos])
    return (
        <div className='container'>
            <div className="main-page">
                <h1>Добавить задачу:</h1>
                <form className='form' onSubmit={(event) => event.preventDefault()}>
                    <div className="row">
                            <Input
                                type='text'
                                id='text'
                                name='input'
                                value={ text }
                                className='validation'
                                onChange={(event) => setText(event.target.value)}
                            />
                    </div>
                    <div className="row">
                        <Button
                            type='primary'
                            onClick={createTodo}
                        >
                            Добавить
                        </Button>
                    </div>
                </form>
                <h2>Активные задачи:</h2>
                <div className="todos">
                    {
                        todos.map((todo, index) => {
                           let cls = ['todos-item']
                           if(todo.completed) {
                               cls.push('completed')
                           }
                           if(todo.important) {
                            cls.push('important')
                        }
                            return (
                                <div className={cls.join(' ')} key={index}>
                                    <div className="todos-num">{index + 1}.</div>
                                    <div className="todos-text">{todo.text}</div>
                                    <div className="todos-buttons">
                                        <CheckOutlined 
                                            onClick={() => completedTodo(todo._id)}
                                            className='todos-buttons-check'
                                        />
                                        <WarningOutlined
                                            onClick={() => importantTodo(todo._id)}
                                            className='todos-buttons-warning'
                                        />
                                        <DeleteOutlined
                                            onClick={() => deleteTodo(todo._id)}
                                            className='todos-buttons-delete'
                                        />
                                    </div>
                                </div>
                            )
                       })
                    }
                </div>
            </div>
        </div>
    )
}
