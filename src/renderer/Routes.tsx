import * as React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Layout from './Layout';
import NexusDropzone from './NexusDropzone/NexusDropzone';
import Settings from './Settings';

const Routes = () => {
  return (
    <HashRouter>
      <Layout>
        <Route path="/" exact={true} component={NexusDropzone} />
        <Route path="/settings" component={Settings} />
      </Layout>
    </HashRouter>
  );
};

export default Routes;
