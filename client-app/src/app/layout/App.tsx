import React, { Fragment } from 'react';
import Main from './Main';
import HomePage from '../../features/home/HomePage';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';

function App() {
    return (
        <Fragment>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/*" element={<Main />} />
            </Routes>
        </Fragment>
    );
}

export default observer(App);