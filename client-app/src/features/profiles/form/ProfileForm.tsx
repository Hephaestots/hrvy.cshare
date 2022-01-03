import React from 'react';
import { Formik, Form } from 'formik';
import { Button, Header, Segment } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';

// Custom React components.
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';

// Custom Variables.
import { ProfileValidationSchema } from '../../../app/models/validation/profileValidationSchema';
import Profile from '../../../app/models/profile';
import { useStore } from '../../../app/stores/store';

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileForm({ setEditMode }: Props) {

    const { profileStore } = useStore();
    const { profile, editProfile } = profileStore;

    const handleFormSubmit = (values: Partial<Profile>) => {
        editProfile(values).then(() => {
            setEditMode(false)
        });
    }

    return (
        <Segment clearing>
            <Header content='Profile Details' sub color='teal' />
            <Formik
                enableReinitialize
                initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
                onSubmit={values => handleFormSubmit(values)}
                validationSchema={ProfileValidationSchema}
            >
                {({ isValid, isSubmitting, dirty, handleSubmit }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <TextInput placeholder='Display Name' name='displayName' />
                        <TextArea rows={12} placeholder='Tell us about yourself!' name='bio' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated='right'
                            positive
                            type='submit'
                            content='Submit'
                        />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
});