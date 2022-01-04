import Activity, { newBaseActivity } from './../models/activity';
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

    updateActivity = async (activity: Activity) => {
        var simpleActivity = newBaseActivity(activity);
        try {
            await agent.Activities.update(simpleActivity as Activity);
            runInAction(() => {
                let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                this.activityRegistry.set(activity.id, updatedActivity);
                this.selectedActivity = updatedActivity;
            });
        } catch (error) {
            console.log(error);
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

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
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
}