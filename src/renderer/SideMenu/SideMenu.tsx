import * as React from 'react';
import List from '@material-ui/core/List';
import { ListItem } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';

const SideMenu = () => {
  return (
    <React.Fragment>
      <List>
        <Link to="/">
          <ListItem button={true}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
      </List>
      <List>
        <Link to="/settings">
          <ListItem button={true}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </Link>
      </List>
    </React.Fragment>
  );
};

export default SideMenu;
