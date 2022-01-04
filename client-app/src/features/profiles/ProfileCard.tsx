import React from 'react';
import { observer } from 'mobx-react-lite';
import Profile from '../../app/models/profile';
import { Card, Divider, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({ profile }: Props) {

    function truncate(str: string | undefined) {
        if (str)
            return ((str.length > 65) ? str.substring(0, 62) + '...' : str);
    }

    return ( 
        <Card extra as={Link} to={`/profiles/${profile.username}`}>
            <Card.Content className='hoverCard'>
                <Image size='small' src={profile.image || '/assets/user.png'} />
                <Divider fitted hidden />
                <Card.Header content={profile.displayName} />
                {profile.following && <span style={{ color: 'darkseagreen', fontSize: '0.75em' }}>Following</span>}
                <Divider fitted />
                <Card.Description className='hoverDesc' content={truncate(profile.bio) || 'Bio goes here...'} />
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount}
            </Card.Content>
        </Card>
    );
});