import './sidebar.css';
import { ChevronLeft, ChevronRight, ExitToApp } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { Drawer, IconButton, Theme } from '@mui/material';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import PlayerList from '../PlayerList/PlayerList';
import { Tooltip } from '@mui/material';
import Dialog from '../../Dialog/Dialog';
import React from 'react';
import { useCallback, useState } from 'react';
import { selectIsGameMaster } from '../../../state/slices/userSlice';
import { RootState } from '../../../state/rootReducer';
import { useSelector } from 'react-redux';

const RightSidebar = (): JSX.Element => {
  const theme = useTheme<Theme>();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaveGameDialogue, setLeaveGameDialogue] = React.useState(false);
  const isGameMaster = useSelector((state: RootState) => selectIsGameMaster(state));

  const toggleSidebarOpen = useCallback(() => {
    setSidebarOpen((prevSidebarOpen: boolean) => !prevSidebarOpen);
  }, []);

  const toggleSettingsOpen = useCallback(() => {
    setSettingsOpen((prevSettingsOpen: boolean) => !prevSettingsOpen);
  }, []);

  return (
    <div className="canvas-sidebar" style={{ backgroundColor: theme.palette.primary.light }}>
      <IconButton
        className="open-close-button"
        style={{
          right: sidebarOpen ? '20%' : '0%',
        }}
        aria-label={`${sidebarOpen ? 'Close' : 'Open'} the sidebar`}
        component="span"
        onClick={toggleSidebarOpen}
      >
        {sidebarOpen ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
      <Drawer anchor="right" className="container" open={sidebarOpen} variant="persistent">
        <Header
          exposeSettings={isGameMaster}
          settingsOpen={isGameMaster && settingsOpen}
          onSettingsToggleClicked={toggleSettingsOpen}
        />
        <PlayerList settingsOpen={isGameMaster && settingsOpen} />
        {isGameMaster && settingsOpen && <Footer />}
      </Drawer>
      <div
        className="top-toolbar"
        style={{
          right: sidebarOpen ? '20%' : '0%',
        }}
      >
        <Tooltip className="first-button" title="Exit game" placement="left">
          <IconButton aria-label="exit game" onClick={() => setLeaveGameDialogue(true)}>
            <ExitToApp />
          </IconButton>
        </Tooltip>
      </div>
      <Dialog
        header="Are you sure you wish to leave the game?"
        description="Doing so will redirect you to game overview."
        open={leaveGameDialogue}
        onClose={() => setLeaveGameDialogue(false)}
        onAgree={() => setLeaveGameDialogue(false)}
        onAgreeRedirectTo="/games"
        onDisagree={() => setLeaveGameDialogue(false)}
      />
    </div>
  );
};

export default RightSidebar;
