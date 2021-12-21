import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/Activity';
import { useStore } from '../../../app/stores/store';

interface Props {
    activity: Activity
}

export default observer(function ActivityListItem({activity}: Props) {

    const { activityStore } = useStore();
    const { loading, deleteActivity } = activityStore;

    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob!</Item.Description>
                            <Item.Extra>
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' key={activity.id} /> {activity.date}
                    <p />
                    <Icon name='marker' key={activity.id} /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View' />
            </Segment>
        </Segment.Group>
    )
})