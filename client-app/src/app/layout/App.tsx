import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import HomePage from '../../features/home/HomePage';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation } from 'react-router-dom';

function App() {

    const location = useLocation();

    return (
        <Fragment>
            {location.pathname !== "/" &&
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
                </Fragment>}
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Fragment>
    );
}

export default observer(App);
