export default interface Profile {
    displayName: string;
    username: string;
    bio?: string;
    image?: string;
}

const emptyProfile = (): Profile => ({
    displayName: '',
    username: '',
    image: ''
});

export const newProfile = <T extends Partial<Profile>>(initialValues: T): Profile & T => {
    return Object.assign(emptyProfile(), initialValues);
}