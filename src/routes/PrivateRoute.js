import React, {useContext} from 'react';
import {Switch, Route, BrowserRouter, Redirect} from 'react-router-dom';

import PropTypes from 'prop-types';

import Default from '../components/layouts/default';
import {Context as AuthContext} from '../components/stores/Auth';

const PrivateRoute = ({component: Component, ...rest}) => {
  const {token, hasData} = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={() =>
        token ? (
          hasData ? (
            <Default>
              <Component {...rest} />
            </Default>
          ) : (
            <Redirect to="/perfil" />
          )
        ) : (
          <Redirect to="/entrar" />
        )
      }
    />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
};

PrivateRoute.defaultProps = {
  component: () => <></>,
};

export default PrivateRoute;
