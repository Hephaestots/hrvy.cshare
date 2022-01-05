import React from 'react';
import { observer } from 'mobx-react-lite';
import Profile from '../../app/models/profile';
import { Card, Divider, Icon, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

interface Props {
    profile: Profile;
    activeTab: any;
}

export default observer(function ProfileCard({ activeTab, profile }: Props) {

    function truncate(str: string | undefined) {
        if (str)
            return ((str.length > 25) ? str.substring(0, 22) + '...' : str);
    }

    return (
        <Card
            style={(activeTab && (activeTab === 3 || activeTab === 4) && !profile.following)
                ? { opacity: 0.75 } : null}
            as={Link}
            to={`/profiles/${profile.username}`}>
            <Card.Content className='hoverCard'>
                <Image size='small' src={profile.image || '/assets/user.png'} />
                <Card.Header textAlign='center' style={{ marginTop: '0.3em' }} content={profile.displayName} />
                <Divider fitted />
                <Card.Description className='hoverDesc' content={truncate(profile.bio) || 'Bio goes here...'} />
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount}
            </Card.Content>
            <FollowButton profile={profile} />
        </Card>
    );
});