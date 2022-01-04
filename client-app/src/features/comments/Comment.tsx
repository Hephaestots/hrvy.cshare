import React from 'react';
import { observer } from 'mobx-react-lite';
import { ActivityComment } from '../../app/models/comment';
import { Comment } from 'semantic-ui-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface Props {
    comment: ActivityComment;
}

export default observer(function CustomComment({ comment }: Props) {
    return (
        <Comment>
            <Comment.Avatar as='a' src={comment.image || '/assets/user.png'} />
            <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                    {comment.displayName}
                </Comment.Author>
                <Comment.Metadata>
                    <span>{formatDistanceToNow(comment.createdAt) + ' ago'}</span>
                </Comment.Metadata>
                <Comment.Text className='commentExtra'>
                    {comment.body}
                </Comment.Text>
                <Comment.Actions>
                    <Comment.Text as='a' content='Reply' />
                </Comment.Actions>
            </Comment.Content>
        </Comment>
    );
});