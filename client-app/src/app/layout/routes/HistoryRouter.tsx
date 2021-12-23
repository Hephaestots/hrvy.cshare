import React from "react";
import { History } from "history";
import { BrowserRouterProps as NativeBrowserRouterProps, Router } from "react-router-dom";

/**
 * https://github.com/remix-run/react-router/issues/8264#issuecomment-973920319
 * Customized the basic BrowserRouter from rrdv6, 
 * so we can pass down the history to the whole app.
 * */
export interface BrowserRouterProps extends Omit<NativeBrowserRouterProps, "window"> {
    history: History;
}

export const BrowserRouter: React.FC<BrowserRouterProps> = React.memo(props => {
    const { history, ...restProps } = props;
    const [state, setState] = React.useState({
        action: history.action,
        location: history.location,
    });

    React.useLayoutEffect(() => history.listen(setState), [history]);

    return (
        <Router
            {...restProps}
            location={state.location}
            navigationType={state.action}
            navigator={history} />
    );
});