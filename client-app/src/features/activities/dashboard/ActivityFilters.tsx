import React, { Fragment } from 'react';
import { Header, Menu } from 'semantic-ui-react';
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityFilters() {

    const { activityStore } = useStore();
    const { predicate, setPredicate } = activityStore;

    return (
        <Fragment>
            <Menu vertical size='large' style={{ width: '100%', marginTop: 25 }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item
                    active={predicate.has('all')}
                    content='All Activities'
                    onClick={() => setPredicate('all', 'true')}
                />
                <Menu.Item
                    active={predicate.has('isGoing')}
                    content="I'm going"
                    onClick={() => setPredicate('isGoing', 'true')}
                />
                <Menu.Item
                    active={predicate.has('isHost')}
                    content="I'm hosting"
                    onClick={() => setPredicate('isHost', 'true')}
                />
            </Menu>
            <Header />
            <Calendar
                onChange={(date: Date) => setPredicate('startDate', date as Date)}
                value={predicate.get('startDate') || new Date()}
            />
        </Fragment>
    )
});