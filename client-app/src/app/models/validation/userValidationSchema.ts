import * as Yup from 'yup';

export const userLoginValidationSchema = Yup.object({
    email: Yup.string().required('The email is required.').email(),
    password: Yup.string().required('The password is required.')
});

export const userRegisterValidationSchema = Yup.object({
    email: Yup.string().required('The email is required.').email(),
    password: Yup.string().required('The password is required.'),
    displayName: Yup.string().required('The displayName is required.'),
    username: Yup.string().required('The username is required.')
});