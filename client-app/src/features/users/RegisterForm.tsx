import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Formik, Form, ErrorMessage } from 'formik';

// Custom React components.
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

// Custom Variables.
import { userRegisterValidationSchema } from '../../app/models/validation/userValidationSchema';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function RegisterForm() {

    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore
                    .register(values)
                    .catch(error => setErrors({ error }))}
            validationSchema={userRegisterValidationSchema}
        >
            {({ dirty, errors, isSubmitting, isValid, handleSubmit }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <Header
                        as='h2'
                        content='Sign up to Reactivities!'
                        color='teal'
                        textAlign='center'
                    />
                    <TextInput name='displayName' placeholder='Display Name' />
                    <TextInput name='username' placeholder='Username' />
                    <TextInput name='email' placeholder='Email' />
                    <TextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <ValidationErrors errors={errors.error} />}
                    />
                    <Button
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting}
                        positive
                        content='Register'
                        type='submit'
                        fluid />
                </Form>
            )}
        </Formik>
    );
});