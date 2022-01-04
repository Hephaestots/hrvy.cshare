import React from 'react';
import { observer } from 'mobx-react-lite';
import { Image, List, Popup } from 'semantic-ui-react';
import Profile from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';
import { Link } from 'react-router-dom';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {

    const styles = {
        border: '0.2em solid darkseagreen'
    }

    return (
        <List horizontal>
            {attendees.map(attendee => (
                <Popup 
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item
                            as={Link}
                            key={attendee.username}
                            to={`/profiles/${attendee.username}`}
                        >
                            <Image
                                circular
                                size='mini'
                                src={attendee.image || '/assets/user.png'}
                                style={attendee.following ? styles : null}
                            />
                        </List.Item>}
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>                  
            ))}
        </List>
    );
});