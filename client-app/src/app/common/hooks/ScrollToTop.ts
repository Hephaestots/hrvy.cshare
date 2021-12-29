import { useEffect } from 'react';
import { history } from '../../../app/layout/base/history';

export default function ScrollToTop() {
    useEffect(() => {
        const unlisten = history.listen(() => {
            window.scrollTo(0, 0);
        });
        return () => {
            unlisten();
        }
    }, []);

    return (null);
};