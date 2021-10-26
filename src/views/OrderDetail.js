import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import peopleFill from '@iconify/icons-eva/people-fill';
import roundPermMedia from '@iconify/icons-ic/round-perm-media';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Tab, Box, Card, Tabs, Container } from '@material-ui/core';
// redux
import {
  getAllAuthors,
  getAllEditors,
  getOrderDetail,
  getOrderResult
} from '../redux/slices/order';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// hooks
import useAuth from '../hooks/useAuth';
// components
import Page from '../components/Page';
import HeaderDashboard from '../components/HeaderDashboard';
import { Task, ProfileCover } from '../components/order/profile';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

export default function OrderDetail() {
  const dispatch = useDispatch();
  const { id } = useParams(); // order id
  const { user } = useAuth();
  const role = user.role;
  const [currentTab, setCurrentTab] = useState('Task');

  const { orderdetail, orderresult } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllAuthors());
    dispatch(getAllEditors());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getOrderDetail(id));
    dispatch(getOrderResult(id));
  }, [dispatch, id]);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  let PROFILE_TABS = [
    {
      value: 'Task',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: (
        <Task
          orderresult={orderresult}
          orderdetail={orderdetail}
          orderid={id}
        />
      )
    }
  ];

  return (
    <Page title="Order: Detail">
      <Container>
        <HeaderDashboard
          heading="Order Detail"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Orders', href: PATH_DASHBOARD.order.buyerorderlist },
            { name: orderdetail.client_name }
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover authUser={orderdetail} />

          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={handleChangeTab}
            >
              {PROFILE_TABS.map((tab, index) => (
                <Tab
                  disableRipple
                  key={index}
                  value={tab.value}
                  icon={tab.icon}
                  label={capitalCase(tab.value)}
                />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab, index) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={index}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
