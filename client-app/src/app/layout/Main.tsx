import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';

// Features
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import NotFound from '../../features/errors/NotFound';
import ProfilePage from '../../features/profiles/ProfilePage';
import ServerError from '../../features/errors/ServerError';
import TestErrors from '../../features/errors/TestErrors';

// Other
import NavBar from './NavBar';
import PrivateRoute from './routes/PrivateRoute';
import ScrollToTop from '../common/hooks/ScrollToTop';

export default observer(function Main() {
    return (
        <Fragment>
            <ScrollToTop />
            <ToastContainer position='bottom-right' hideProgressBar />
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/activities" element={<ActivityDashboard />} />
                        <Route path="/activities/:id" element={<ActivityDetails />} />
                        <Route path="/createActivity" element={<ActivityForm />} />
                        <Route path="/manage/:id" element={<ActivityForm />} />
                        <Route path="/profiles/:username" element={<ProfilePage />} />
                        <Route path="/errors" element={<TestErrors />} />
                    </Route>
                    <Route path="/server-error" element={<ServerError />} />
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </Container>
        </Fragment>
    )
});
