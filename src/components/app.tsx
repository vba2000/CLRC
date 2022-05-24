import { FunctionalComponent, h } from 'preact';
import { Route, Router, route } from 'preact-router';

import Home from '../routes/home';
import Profile from '../routes/profile';
import NotFoundPage from '../routes/notfound';
import Header from './header';
import {useStore} from "../services/Store";
import { settings } from "../enviroments/mainnet";
import Login from "../routes/login";
import Stats from "../routes/stats";


const App: FunctionalComponent = () => {
    const data = useStore(settings)

    return (
        <div id="preact_root">
            <Header user={data.user}/>
            <Router>
                <Route path="/" component={Home} store={data}/>
                <Route path="/invest/" component={Profile} store={data}/>
                <Route path="/stats/" component={Stats} store={data}/>
                <Route path="/login" component={Login} selectProvider={data.selectProvider}/>
                <NotFoundPage default />
            </Router>
        </div>
    );
};

export default App;
