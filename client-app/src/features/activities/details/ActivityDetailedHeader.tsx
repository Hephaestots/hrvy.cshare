import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image, Label } from 'semantic-ui-react'
import Activity from "../../../app/models/activity";
import { useStore } from '../../../app/stores/store';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {

    const { activityStore } = useStore();
    const { loading, cancelActivityToggle, updateAttendance } = activityStore;

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                {activity.isCancelled &&
                    <Label
                        style={{ position: 'absolute', zIndex: 1000, left: -14, top: 20 }}
                        ribbon
                        color='red'
                        content='Cancelled' />
                }
                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date!, 'dd MMM yyyy h:mm aa')}</p>
                                <p>
                                    Hosted by
                                    <strong>
                                        <Link to={`/profiles/${activity.hostUsername}`}> {activity.host?.displayName}</Link>
                                    </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <Fragment>
                        <Button
                            color={activity.isCancelled ? 'green' : 'red'}
                            floated='left'
                            basic
                            content={activity.isCancelled ? 'Re-activate' : 'Cancel'}
                            onClick={cancelActivityToggle}
                            loading={loading}
                        />
                        <Button
                            as={Link}
                            to={`/manage/${activity.id}`}
                            floated='right'
                            content='Manage'
                            disabled={activity.isCancelled}
                        />                    
                    </Fragment>
                ) : (
                    <Button
                        loading={loading}
                        onClick={updateAttendance}
                        color={activity.isGoing ? 'orange' : 'teal'}
                        content={activity.isGoing ? 'Unattend' : 'Attend'}
                        disabled={activity.isCancelled}
                    />         
                )}
            </Segment>
        </Segment.Group>
    )
})