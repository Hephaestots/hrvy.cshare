import * as Yup from 'yup';

export const CommentValidationSchema = Yup.object({
    body: Yup.string().required('The comment requires a body.')
});