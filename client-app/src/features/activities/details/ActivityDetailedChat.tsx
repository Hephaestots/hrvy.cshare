import { observer } from 'mobx-react-lite';
import React, { Fragment, useEffect } from 'react';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useStore } from '../../../app/stores/store';
import CustomComment from '../../comments/Comment';
import { CommentValidationSchema } from '../../../app/models/validation/commentValidationSchema';
import { Comment, Divider, Header, Loader, Segment } from 'semantic-ui-react';

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {

    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId])

    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header as='h3' dividing>
                    Comments
                </Header>
            </Segment>
            <Segment attached='bottom' clearing>
                <Formik
                    enableReinitialize
                    initialValues={{ body: '' }}
                    onSubmit={(values, { resetForm }) =>
                        commentStore.addComment(values).then(() => resetForm())}
                    validationSchema={CommentValidationSchema}
                >
                    {({ isValid, isSubmitting, handleSubmit }) => (
                        <Form
                            className='ui form'>
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, SHIFT + enter for new line)'
                                            rows={2}
                                            {...props.field}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && e.shiftKey)
                                                    return;
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
                <Fragment>
                    {(commentStore.comments.length > 0) &&
                        <Divider />
                    }
                    <Comment.Group threaded>
                        {commentStore.comments.map((comment) => (
                            <CustomComment key={comment.id} comment={comment} />
                        ))}
                    </Comment.Group>
                </Fragment>
            </Segment>
        </Fragment>
    )
})