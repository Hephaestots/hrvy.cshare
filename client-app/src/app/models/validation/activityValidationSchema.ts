import * as Yup from 'yup';

export const activitySchema = Yup.object({
    title: Yup.string().required('The activity title is required.'),
    description: Yup.string().required('The activity description is required.'),
    category: Yup.string().required(),
    date: Yup.date().required('Date is required.').nullable(),
    city: Yup.string().required(),
    venue: Yup.string().required()
});