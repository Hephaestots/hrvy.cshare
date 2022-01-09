import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../stores/store';

export default function PrivateRoute() {

    const { userStore: { isLoggedIn } } = useStore();

    return isLoggedIn ?
        <Outlet /> :
        <Navigate to='/' />
};