import './App.css';
import Navbar from "./components/Navbar/Navbar";
import News from "./components/News/News";
import Music from "./components/Music/Music";
import Settings from "./components/Settings/Settings";
import {HashRouter, Navigate, Route, Routes} from "react-router-dom";
import HeaderContainer from "./components/Header/HeaderContainer";
import LoginContainer from "./components/Login/LoginContainer";
import React, {Component} from "react";
import {connect, Provider} from "react-redux";
import {withRouter} from "./utils/hoc/withRouter";
import {compose} from "redux";
import {initializeApp} from "./store/reducers/app";
import Preloader from "./components/common/Preloader/Preloader";
import index from "./store";
import NewUsersBarContainer from "./components/Sidebar/NewUsersBar/NewUsersBarContainer";

const DialogsContainer = React.lazy(() => import("./components/Dialogs/DialogsContainer"));
const ProfileContainer = React.lazy(() => import("./components/Profile/ProfileContainer"));
const UsersContainer = React.lazy(() => import("./components/Users/UsersContainer"));

class App extends Component {
    catchAllUnhandledErrors = (promiseRejectionEvent) => {
        console.log(promiseRejectionEvent);
    }
    componentDidMount() {
        this.props.initializeApp();
        window.addEventListener("unhandledrejection", this.catchAllUnhandledErrors)
    }
    componentWillUnmount() {
        window.removeEventListener("unhandledrejection", this.catchAllUnhandledErrors)
    }

    render() {

        if (!this.props.initialized) return <Preloader/>

        return (
            <div className="app-wrapper">
                <HeaderContainer/>
                <div className="sidebar">
                    <Navbar/>
                    <NewUsersBarContainer/>
                </div>
                <div className="app-wrapper-content">
                    <React.Suspense fallback={<div>Loader...</div>}>
                        <Routes>
                            <Route path='/profile/' element={<ProfileContainer/>}>
                                <Route path=':userId' element={<ProfileContainer/>}/>
                            </Route>
                            <Route path='/dialogs/*' element={<DialogsContainer/>}/>
                            <Route path='/users' element={<UsersContainer/>}/>
                            <Route path='/news' element={<News/>}/>
                            <Route path='/music' element={<Music/>}/>
                            <Route path='/settings' element={<Settings/>}/>
                            <Route path='/login' element={<LoginContainer/>}/>
                            <Route path="/" element={<Navigate to="/profile"/>}/>
                            <Route path="*" element={<div>404 Page not found</div>}/>
                        </Routes>
                    </React.Suspense>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    initialized: state.app.initialized
})

let AppContainer = compose(
    withRouter,
    connect(mapStateToProps, {initializeApp}))(App);

const SamuraiJSApp = () => {
    return (
        <HashRouter>
            <Provider store={index}>
                <AppContainer/>
            </Provider>
        </HashRouter>
    )
}

export default SamuraiJSApp;