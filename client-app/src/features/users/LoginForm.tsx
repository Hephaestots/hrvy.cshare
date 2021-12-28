import React from 'react';
import { Button, Header, Label } from 'semantic-ui-react';
import { Formik, Form, ErrorMessage } from 'formik';

// Custom React components.
import TextInput from '../../app/common/form/TextInput';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

// Custom Variables.
import { userLoginValidationSchema } from '../../app/models/validation/userValidationSchema';

export default observer(function LoginForm() {

    const { userStore } = useStore();

    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) =>
                userStore
                    .login(values)
                    .catch(error => setErrors({ error: 'Invalid email or password.' }))}
            validationSchema={userLoginValidationSchema}
        >
            {({ dirty, errors, isSubmitting, isValid, handleSubmit }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header
                        as='h2'
                        content='Login to Reactivities!'
                        color='teal'
                        textAlign='center'
                    />
                    <TextInput name='email' placeholder='Email' />
                    <TextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage
                        name='error'
                        render={() =>
                            <Label
                                style={{ marginBottom: 10 }}
                                basic
                                color='red'
                                content={errors.error} />}
                    />
                    <Button
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting}
                        positive
                        content='Login'
                        type='submit'
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
});