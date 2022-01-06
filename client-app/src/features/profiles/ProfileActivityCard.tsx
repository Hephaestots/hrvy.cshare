import React from 'react';
import { observer } from 'mobx-react-lite';
import UserActivity from '../../app/models/userActivity';
import { Item, Label, Placeholder } from 'semantic-ui-react';

interface Props {
    activity: UserActivity;
}

export default observer(function ProfileActivityCard({ activity }: Props) {
    return (
        <Item header style={activity.isCancelled ? { opacity: 0.85 } : null}>
            <Item.Image src={`/assets/categoryImages/${activity.category}.jpg`} />

            <Item.Content>
                <Item.Header as='a'>
                    {activity.title}
                </Item.Header>
                <br />
                <Item.Meta>
                    <span className='cinema'>
                        {new Date(activity.date).toLocaleString('en-us', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                </Item.Meta>
                <Item.Description>
                    <Placeholder>
                        <Placeholder.Paragraph>
                            <Placeholder.Line length='medium' />
                            <Placeholder.Line length='short' />
                        </Placeholder.Paragraph>
                    </Placeholder>
                </Item.Description>
                <Item.Extra>
                    {activity.isCancelled &&
                        <Label basic color='red'>Cancelled</Label>
                    }
                </Item.Extra>
            </Item.Content>
        </Item>
    );
});