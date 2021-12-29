import Activity, { baseActivity } from './../models/activity';
import { newProfile } from './../models/profile';
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { format } from 'date-fns';
import { store } from './store';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    loading = false;
    loadingInitial = false;
    selectedActivity: Activity | undefined = undefined;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
                    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, 'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => (a.username === user.username)
            );
            activity.isHost = (activity.hostUsername === user.username);
            activity.host = activity.attendees?.find(a =>
                (a.username === activity.hostUsername)
            );
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    /**
     * Creating a new activity to our list of activities (in db).
     * @param activity
     */
    createActiviy = async (activity: Activity) => {
        const user = store.userStore.user;
        const attendee = newProfile({
            displayName: user!.displayName,
            username: user!.username,
            image: user!.image
        });
        try {
            await agent.Activities.create(activity);
            activity.hostUsername = user!.username
            activity.attendees = [attendee];
            this.setActivity(activity);
            runInAction(() => {
                this.selectedActivity = activity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Loading all of our activities from the db.
     */
    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    this.setActivity(activity);
                });
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    /**
     * Loading a specific activity from the db.
     * @param id
     */
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    /**
     * Updating a specific activity from our list of activities (in db).
     * @param activity
     */
    updateActivity = async (activity: Activity) => {
        var simpleActivity = baseActivity({
            id: activity.id,
            category: activity.category,
            city: activity.city,
            date: activity.date,
            description: activity.description,
            title: activity.title,
            venue: activity.venue
        }); 
        try {
            await agent.Activities.update(simpleActivity as Activity);
            runInAction(() => {
                let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                this.activityRegistry.set(activity.id, updatedActivity);
                this.selectedActivity = updatedActivity;
            })
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Deleting a specific activity from our list of activities (in db).
     * @param id
     */
    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    /**
     * Update attendance for a specific activity.
     * */
    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    var profile = newProfile(user!);
                    this.selectedActivity?.attendees?.push(profile);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }
}