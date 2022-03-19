import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { AuthPage } from './pages/authPage/AuthPage'
import { MainPage } from './pages/mainPage/MainPage'

export const useRoutes = (isLogin) => {
    if(isLogin) {
        return (
            <Switch>
                <Route path='/' exact component={MainPage} />
                <Redirect to='/' />
            </Switch>
        )
    } else {
        return (
            <Switch>
                <Route path='/login' exact component={AuthPage} />
                <Redirect to='/login' />
            </Switch>
        )
    }
}
