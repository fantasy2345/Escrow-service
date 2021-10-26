import { lazy } from 'react';
import { Redirect } from 'react-router-dom';
// guards
import AuthGuard from '../guards/AuthGuard';
// layouts
import DashboardLayout from '../layouts/dashboard';
//
import { PATH_DASHBOARD } from './paths';

// ----------------------------------------------------------------------

const DashboardRoutes = {
  path: PATH_DASHBOARD.root,
  guard: AuthGuard,
  layout: DashboardLayout,
  routes: [
    // GENERAL
    // ----------------------------------------------------------------------
    {
      exact: true,
      path: PATH_DASHBOARD.root,
      component: () => <Redirect to={PATH_DASHBOARD.user.useraccount} />
    },

    // MANAGEMENT : USER
    // ----------------------------------------------------------------------
    {
      exact: true,
      path: PATH_DASHBOARD.user.profile,
      component: lazy(() => import('../views/UserProfile'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.order.detail,
      component: lazy(() => import('../views/OrderDetail'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.list,
      component: lazy(() => import('../views/UserList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.customerlist,
      component: lazy(() => import('../views/CustomerList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.order.buyerorderlist,
      component: lazy(() => import('../views/BuyerOrderList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.order.sellerorderlist,
      component: lazy(() => import('../views/SellerOrderList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.authorlist,
      component: lazy(() => import('../views/AuthorList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.editorlist,
      component: lazy(() => import('../views/EditorList'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.account,
      component: lazy(() => import('../views/UserAccount'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.useraccount,
      component: lazy(() => import('../views/Account'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.user.root,
      component: () => <Redirect to={PATH_DASHBOARD.user.profile} />
    },
    {
      exact: true,
      path: PATH_DASHBOARD.order.neworder,
      component: lazy(() => import('../views/neworder'))
    },

    // APP : CHAT
    // ----------------------------------------------------------------------
    {
      exact: true,
      path: PATH_DASHBOARD.chat.conversation,
      component: lazy(() => import('../views/Chat'))
    },
    {
      exact: true,
      path: PATH_DASHBOARD.chat.root,
      component: () => <Redirect to={PATH_DASHBOARD.chat.new} />
    },

    // ----------------------------------------------------------------------

    {
      component: () => <Redirect to="/404" />
    }
  ]
};

export default DashboardRoutes;
