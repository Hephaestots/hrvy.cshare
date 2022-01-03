import React, { Fragment, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Divider, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import ProfileForm from './form/ProfileForm';

export default observer(function ProfileAbout() {

    const { profileStore } = useStore();
    const { profile, isCurrentUser } = profileStore;

    const [editMode, setEditMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header icon='user' floated='left' content='About ' />
                    {isCurrentUser && (
                        <Button
                            floated='right'
                            basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                            color={editMode ? 'red' : 'teal'}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <ProfileForm setEditMode={setEditMode} />
                    ) : profile && (
                            <Fragment>
                                <Header content={`Bio`} />
                                <Divider />
                                <span style={{whiteSpace: 'pre-wrap'}}>{profile.bio || "We don't know you yet..."}</span>
                            </Fragment>
                    )}
                </Grid.Column>
            </Grid>        </Tab.Pane>    
    );
});