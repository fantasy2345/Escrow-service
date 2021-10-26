import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { Container, Tab, Box, Tabs } from '@material-ui/core';
// redux
import {
  getCards,
  getProfile,
  getAddressBook,
  getNotifications
} from '../redux/slices/user';
import useAuth from 'src/hooks/useAuth';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import Page from '../components/Page';
import HeaderDashboard from '../components/HeaderDashboard';
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword
} from '../components/user/account';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const [currentTab, setCurrentTab] = useState('general');
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { cards, invoices, myProfile, notifications } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    dispatch(getCards());
    dispatch(getAddressBook());
    dispatch(getNotifications());
    dispatch(getProfile());
  }, [dispatch]);

  if (!myProfile) {
    return null;
  }

  if (!cards) {
    return null;
  }

  if (!notifications) {
    return null;
  }

  let ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      value: 'change_password',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePassword />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Page title="User: Account Settings | ESCROW">
      <Container>
        <HeaderDashboard
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Account Settings' }
          ]}
        />

        <Tabs
          value={currentTab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
