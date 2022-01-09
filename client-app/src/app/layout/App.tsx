import React, { Fragment, useEffect } from 'react';
import Main from './Main';
import HomePage from '../../features/home/HomePage';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import { useStore } from '../stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';
import ModalContainer from '../../app/common/modals/ModalContainer';

function App() {

    const { commonStore, userStore } = useStore();

    useEffect(() => {
        if (commonStore.token) {
            userStore.getUser().finally(() => commonStore.setAppLoaded());
        } else {
            commonStore.setAppLoaded();
        }
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

    return (
        <Fragment>
            <ModalContainer />
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="/*" element={<Main />} />
            </Routes>
        </Fragment>
    );
}

export default observer(App);