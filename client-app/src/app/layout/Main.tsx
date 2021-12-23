import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ServerError from '../../features/errors/ServerError';
import TestErrors from '../../features/errors/TestErrors';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';

export default observer(function Main() {
    return (
        <Fragment>
            <ToastContainer position='bottom-right' hideProgressBar />
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Routes>
                    <Route path="/activities" element={<ActivityDashboard />} />
                    <Route path="/activities/:id" element={<ActivityDetails />} />
                    <Route path="/createActivity" element={<ActivityForm />} />
                    <Route path="/manage/:id" element={<ActivityForm />} />
                    <Route path="/errors" element={<TestErrors />} />
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </Container>
        </Fragment>
    )
});
