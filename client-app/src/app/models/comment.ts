export interface ActivityComment {
    id: number;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}

const emptyComment = (): ActivityComment => ({
    id: -1,
    createdAt: new Date(),
    body: '',
    username: '',
    displayName: '',
    image: ''
});

export const newComment = <T extends Partial<ActivityComment>>(comment?: T): ActivityComment & T => {
    return Object.assign(emptyComment(), comment);
}