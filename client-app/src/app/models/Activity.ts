import Profile from './profile';

export interface BaseActivity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
}

export default interface Activity extends BaseActivity {
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees?: Profile[];
}

const emptyBaseActivity = (): BaseActivity => ({
    id: '',
    title: '',
    date: null,
    description: '',
    category: '',
    city: '',
    venue: ''
});

const emptyActivity = (): Activity => ({
    ...emptyBaseActivity(),
    hostUsername: '',
    isCancelled: false,
    isGoing: false,
    isHost: false,
    attendees: []
});

export const newActivity = <T extends Partial<Activity>>(activity?: T): Activity & T => {
    return Object.assign(emptyActivity(), activity);
}

export const newBaseActivity = <T extends Partial<BaseActivity>>(activity: T): BaseActivity => {
    let subset = (({ id, title, date, description, category, city, venue }) =>
        ({ id, title, date, description, category, city, venue }))(activity as BaseActivity);
    return Object.assign(emptyBaseActivity(), subset);
}