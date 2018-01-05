import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { routerRedux, Route, Switch } from 'dva/router';
import IndexPage from './routers/indexPage';

const { ConnectedRouter } = routerRedux;

function RouterConfig({ history }) {
    return (
        <ConnectedRouter history={history}>
            <Route path="/" exact component={IndexPage} />
        </ConnectedRouter>
    );
}

export default RouterConfig;