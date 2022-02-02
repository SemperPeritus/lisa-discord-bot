import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';

import styles from './styles.scss';
import { useAppDispatch, useAppSelector } from 'App/redux';
import { fetchUser } from 'App/redux/discordUser';
import LoginPage from 'App/components/LoginPage';
import DiscordCallbackPage from 'App/components/DiscordCallbackPage';
import Header from 'App/components/Header';
import Navigation from 'App/components/Navigation';
import HomePage from 'App/components/HomePage';
import RequireAuth from 'App/components/RequireAuth';
import ServerPage from 'App/components/ServerPage';

const cx = require('classnames/bind').bind(styles);

function App() {
  const userStore = useAppSelector((state) => state.discordUser);
  const user = userStore.value;

  const cookies = new Cookies();
  const dispatch = useAppDispatch();

  const discordToken = cookies.get('discordToken');
  const isAuth = !!discordToken && !!user;

  useEffect(() => {
    if (discordToken && !user && !userStore.isLoading) {
      dispatch(fetchUser());
    }
  });

  return (
    <div className={cx('app')}>
      <BrowserRouter>
        {isAuth && <Header />}
        <div className={cx('app-content')}>
          {isAuth && <Navigation />}
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <HomePage />
                </RequireAuth>
              }
            />
            <Route
              path="/server/:id"
              element={
                <RequireAuth>
                  <ServerPage />
                </RequireAuth>
              }
            />
            {!isAuth && (
              <>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/discord-callback" element={<DiscordCallbackPage />} />
              </>
            )}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
