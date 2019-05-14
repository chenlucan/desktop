import { observer } from 'mobx-react';
import * as React from 'react';
import { platform } from 'os';

import store from '~/renderer/app/store';
import { StyledToolbar, Buttons, Separator } from './style';
import { NavigationButtons } from '../NavigationButtons';
import { Tabbar } from '../Tabbar';
import ToolbarButton from '../ToolbarButton';
import { icons } from '../../constants';
import { ipcRenderer } from 'electron';
import BrowserAction from '../BrowserAction';
import { Find } from '../Find';
import { AbButton } from '../ToolbarButton/style';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import console = require('console');

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

@observer
class BrowserActions extends React.Component {
  public render() {
    const { selectedTabId } = store.tabGroups.currentGroup;

    return (
      <>
        {selectedTabId &&
          store.extensions.browserActions.map(item => {
            if (item.tabId === selectedTabId) {
              return <BrowserAction data={item} key={item.extensionId} />;
            }
            return null;
          })}
      </>
    );
  }
}

export const toggleAdBlockWindow = () => {
  store.overlay.visible = true;
  store.overlay.currentContent = "adblock";
}

export const viewLauncher = () => {
  store.overlay.visible = true;
  store.overlay.scrollRef.current.scrollTop = 0;
}

export const viewHistory = () => {
  store.overlay.visible = true;
  store.overlay.currentContent = "history";
}

export const viewBm = () => {
  store.overlay.visible = true;
  store.overlay.currentContent = "bookmarks";
}

export const viewPrefs = () => {
  store.overlay.visible = true;
  store.overlay.currentContent = "settings";
}

export const Toolbar = observer(() => {
  return (
    <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen}>
      <NavigationButtons />
      <Tabbar />
      <Find />
      <Buttons>
        <BrowserActions />
        {store.updateInfo.available && (
          <ToolbarButton icon={icons.download} onClick={onUpdateClick} />
        )}
        {store.extensions.browserActions.length > 0 && <Separator />}
        <AbButton onClick={viewLauncher}>
          <BrowserAction
            size={18}
            style={{ marginLeft: 0 }}
            opacity={0.54}
            title="Dot Downloads"
            data={{
              badgeBackgroundColor: 'gray',
              badgeText: store.tabs.selectedTab
                ? store.downloads.list.length > 0
                  ? store.downloads.list.length.toString()
                  : ''
                : '',
              icon: icons.download,
              badgeTextColor: 'white',
            }}
          />          
        </AbButton>
        <AbButton icon={icons.settings} onClick={viewPrefs} title="Dot Settings"/>
        <Separator />
        <AbButton onClick={toggleAdBlockWindow} title="Dot Ad-Blocker">
          <BrowserAction
            size={18}
            style={{ marginLeft: 0 }}
            opacity={0.54}
            title="Dot Ad-Blocker"
            data={{
              badgeBackgroundColor: 'gray',
              badgeText: store.tabs.selectedTab
                ? store.tabs.selectedTab.blockedAds > 0
                  ? store.tabs.selectedTab.blockedAds.toString()
                  : ''
                : '',
              icon: icons.shield,
              badgeTextColor: 'white',
            }}
          />
        </AbButton>
      </Buttons>
    </StyledToolbar>
  );
});
