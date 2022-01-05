import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Divider, Grid, Header, Item, Segment, Statistic } from 'semantic-ui-react';
import Profile from '../../app/models/profile';
import FollowButton from '../profiles/FollowButton';

interface Props {
    profile: Profile;
}

export default observer(function ProfileHeader({ profile }: Props) {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item style={{paddingTop: 10}}>
                            <Item.Image avatar className='segment' size='small' src={profile.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1'>{profile.displayName}
                                    <Header.Subheader>
                                        <Link style={{fontStyle: 'italic'}} to=''>{profile.username}</Link>
                                    </Header.Subheader>
                                </Header>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4} textAlign='center'>
                    <Statistic.Group style={{ paddingLeft: '1.55em' }}>
                        <Statistic label='Followers' value={profile.followersCount} />
                        <Statistic label='Following' value={profile.followingCount} />
                    </Statistic.Group>
                    <Divider />
                    <FollowButton profile={profile} />
                </Grid.Column>
            </Grid>
        </Segment>
    );
});