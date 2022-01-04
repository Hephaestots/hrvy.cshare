import React, { SyntheticEvent } from 'react';
import Profile from '../../app/models/profile';
import { observer } from 'mobx-react-lite';
import { Button, Reveal } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

interface Props {
    profile: Profile
}

export default observer(function FollowButton({ profile }: Props) {

    const { profileStore, userStore } = useStore();
    const { loading, updateFollowing } = profileStore;

    if (userStore.user?.username === profile.username) return null;

    function handleFollow(e: SyntheticEvent, username: string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    return (
        <Reveal animated='move'>
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    color='teal'
                    content={profile.following ? 'Following' : 'Not following'}
                    fluid
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    basic
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    fluid
                    loading={loading}
                    onClick={(e) => handleFollow(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>        
    );
});