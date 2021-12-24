import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';
import DateInput from '../../../app/common/form/DateInput';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import { activitySchema } from '../../../app/models/validation/activityValidationSchema';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import { Activity } from '../../../app/models/Activity';

const emptyState = {
    id: '',
    title: '',
    category: '',
    description: '',
    date: null,
    city: '',
    venue: ''
};

export default observer(function ActivityForm() {

    const navigate = useNavigate();
    const { activityStore } = useStore();
    const { loading, loadingInitial, createActiviy, loadActivity, updateActivity } = activityStore;
    const { id } = useParams<{ id: string }>();

    /**
     * Local state for the form.
     * */
    const [activity, setActivity] = useState<Activity>(emptyState);

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
        else setActivity(emptyState)
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActiviy(newActivity).then(() => navigate(`/activities/${newActivity.id}`));
        } else
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik
                enableReinitialize
                initialValues={activity}
                onSubmit={values => handleFormSubmit(values)}
                validationSchema={activitySchema}
            >
                {({ isValid, isSubmitting, dirty, handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <TextInput placeholder='Title' name='title'  />
                        <TextArea rows={3} placeholder='Description' name='description' />
                        <SelectInput options={categoryOptions} placeholder='Category' name='category' />
                        <DateInput
                            placeholderText='Date'
                            name='date'
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color='teal' />
                        <TextInput placeholder='City' name='city' />
                        <TextInput placeholder='Venue' name='venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit' />
                        <Button as={Link} to="/activities" floated='right' content='Cancel' />
                    </Form>           
                )}
            </Formik>
        </Segment>
    )
});