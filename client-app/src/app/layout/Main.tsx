import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';

export default observer(function Main() {
    return (
        <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Routes>
                    <Route path="/activities" element={<ActivityDashboard />} />
                    <Route path="/activities/:id" element={<ActivityDetails />} />
                    <Route path="/createActivity" element={<ActivityForm />} />
                    <Route path="/manage/:id" element={<ActivityForm />} />
                </Routes>
            </Container>
        </Fragment>
    )
});
