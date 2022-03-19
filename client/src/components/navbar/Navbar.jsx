import { PageHeader, Divider, Button } from 'antd'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import "./Navbar.scss"
export const Navbar = () => {
    const { logout, isLogin } = useContext(AuthContext)
    return (
        <>
            <PageHeader
                        title='To do list'
                        className='brand-logo'
                        extra={[
                            isLogin 
                            ?
                                <Button key="1" type="primary" onClick={ logout }>
                                    Выйти
                                </Button>
                            :
                                <Button key="2" type="primary">
                                    Войти
                                </Button>
                          ]}
                    />
            <Divider
                className='divider'
            />
        </>
    )
}
