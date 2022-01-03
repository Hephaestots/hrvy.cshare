import * as Yup from 'yup';

export const ProfileValidationSchema = Yup.object({
    displayName: Yup.string().required('The displayName is required.')
});
