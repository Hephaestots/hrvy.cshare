import React, { SyntheticEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab } from 'semantic-ui-react';

import { useStore } from '../../app/stores/store';
import ProfileActivityPane from '../profiles/ProfileActivityPane';

export default observer(function ProfileActivities() {
    const panes = [
        { menuItem: 'Upcomming', render: () => <ProfileActivityPane predicate='future' /> },
        { menuItem: 'Past', render: () => <ProfileActivityPane predicate='past' /> },
        { menuItem: 'Hosting', render: () => <ProfileActivityPane predicate='hosting' /> }
    ];

    const { profileStore } = useStore();
    const { profile, loadUserActivities } = profileStore;

    useEffect(() => {
        if (profile) loadUserActivities('future');
    }, [profile, loadUserActivities]);

    function handleTabChange(e: SyntheticEvent, data: any) {
        var predicate = data.panes[data.activeIndex].menuItem.toLowerCase();
        if (profile) loadUserActivities(predicate);
    }

    return (
        <Tab
            menu={{ fluid: true  }}
            menuPosition='left'
            panes={panes}
            onTabChange={(e, data) => handleTabChange(e, data)}
        />
    );
});