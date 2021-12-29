import React from 'react';
import { observer } from 'mobx-react-lite';
import { Image, List } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import { Link } from 'react-router-dom';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item
                    as={Link}
                    key={attendee.username}
                    to={`/profiles/${attendee.username}`}
                >
                    <Image
                        circular
                        size='mini'
                        src={attendee.image || '/assets/user.png'} />
                </List.Item>                    
            ))}
        </List>
    );
});