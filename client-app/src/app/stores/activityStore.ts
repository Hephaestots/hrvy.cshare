import Activity, { newBaseActivity } from './../models/activity';
import { Pagination, PagingParams } from '../models/pagination';
import { newProfile } from './../models/profile';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import agent from '../api/agent';
import { format } from 'date-fns';
import { store } from './store';

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParams = new PagingParams();
    predicate = new Map().set('all', true);
    selectedActivity: Activity | undefined = undefined;

    constructor() {
        makeAutoObservable(this);

        reaction(() => this.predicate.keys(), () => {
            this.pagingParams = new PagingParams();
            this.activityRegistry.clear();
            this.loadActivities();
        });
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get axiosParams() {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParams.pageNumber.toString());
        params.append('pageSize', this.pagingParams.pageSize.toString());
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, (value as Date).toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
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

    setPagination = (pagination: Pagination) => {
        this.pagination = pagination;
    }

    setPagingParams = (pagingParams: PagingParams) => {
        this.pagingParams = pagingParams;
    }

    setPredicate = (predicate: string, value: string | Date) => {
        const resetPredicate = () => {
            this.predicate.forEach((value, key) => {
                if (key !== 'startDate') this.predicate.delete(key);
            });
        }
        switch (predicate) {
            case 'all':
                resetPredicate();
                this.predicate.set('all', true);
                break;
            case 'isGoing':
                resetPredicate();
                this.predicate.set('isGoing', true);
                break;
            case 'isHost':
                resetPredicate();
                this.predicate.set('isHost', true);
                break;
            case 'startDate':
                this.predicate.delete('startDate');
                this.predicate.set('startDate', value);
        }
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
            const result = await agent.Activities.list(this.axiosParams);
            runInAction(() => {
                result.data.forEach(activity => {
                    this.setActivity(activity);
                });
                this.setPagination(result.pagination);
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

    updateAttendeeFollowing = (username: string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees?.forEach(attendee => {
                if (attendee.username === username) {
                    attendee.following ? attendee.followersCount-- : attendee.followersCount++;
                    attendee.following = !attendee.following;
                }
            })
        })
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
}