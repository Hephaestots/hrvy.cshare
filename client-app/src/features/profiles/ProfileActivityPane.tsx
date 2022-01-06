import React from 'react';
import { observer } from 'mobx-react-lite';
import { Item, Grid, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';

import ProfileActivityCard from '../profiles/ProfileActivityCard';

interface Props {
    predicate: string
}

export default observer(function ProfileFollowings({ predicate }: Props) {

    const { profileStore } = useStore();
    const { loadingActivities, userActivities } = profileStore;

    return (
        <Tab.Pane loading={loadingActivities}>
            <Grid>
                <Grid.Column width={16}>
                    <Item.Group divided>
                        {userActivities.map((activity, i) => (
                            <ProfileActivityCard key={i} activity={activity} />
                        ))}
                    </Item.Group>
                </Grid.Column>
            </Grid></Tab.Pane>
    );
});