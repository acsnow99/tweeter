import "./App.css";
import { useContext } from "react";
import { UserInfoContext } from "./components/userInfo/UserInfoProvider";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { ItemView } from "./presenters/ItemPresenter";
import { Status, User } from "tweeter-shared";
import { ItemScroller } from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { UserService } from "./model/service/UserService";

const App = () => {
  const { currentUser, authToken } = useContext(UserInfoContext);

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
        path="feed" 
        element={<ItemScroller
          key={1}
          generateItemComponent={(item) => <StatusItem status={item} />}
          generatePresenter={(view: ItemView<Status>) => new FeedPresenter(view)}
        />} />
        <Route 
        path="story" 
        element={<ItemScroller
          key={2}
          generateItemComponent={(item) => <StatusItem status={item} />}
          generatePresenter={(view: ItemView<Status>) => new StoryPresenter(view)}
        />} />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              generateItemComponent={(item: User) => <UserItem value={item} />}
              generatePresenter={(view: ItemView<User>) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4}
              generateItemComponent={(item: User) => <UserItem value={item} />}
              generatePresenter={(view: ItemView<User>) => new FollowerPresenter(view)}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
