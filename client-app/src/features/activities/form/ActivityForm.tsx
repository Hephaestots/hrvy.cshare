import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { v4 as uuid } from 'uuid';
import { Formik, Form } from 'formik';

// Custom React components.
import DateInput from '../../../app/common/form/DateInput';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';

// Custom Variables.
import { activityValidationSchema } from '../../../app/models/validation/activityValidationSchema';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import Activity, { newActivity } from '../../../app/models/activity';
import { history } from '../../../app/layout/base/history';

export default observer(function ActivityForm() {

    const navigate = useNavigate();
    const { activityStore } = useStore();
    const { loadingInitial, createActiviy, loadActivity, updateActivity } = activityStore;
    const { id } = useParams<{ id: string }>();

    /**
     * Local state for the form.
     * */
    const [activity, setActivity] = useState<Activity>(newActivity(undefined));

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(newActivity(activity)))
        else setActivity(newActivity(undefined))
    }, [id, loadActivity]);

    function handleFormSubmit(activity: Activity) {
        if (!activity.id) {
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
                validationSchema={activityValidationSchema}
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
                            loading={isSubmitting}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit'
                        />
                        <Button
                            onClick={() => history.back()}
                            floated='right'
                            type='reset'
                            content='Cancel'
                        />
                    </Form>           
                )}
            </Formik>
        </Segment>
    )
});