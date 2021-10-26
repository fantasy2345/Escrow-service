// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify/:email')
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  page404: '/404',
  page500: '/500'
};

export const PATH_HOME = {
  cloud: 'https://www.sketch.com/s/0fa4699d-a3ff-4cd5-a3a7-d851eb7e17f0',
  purchase: 'https://material-ui.com/store/items/minimal-dashboard/',
  components: '/components',
  dashboard: ROOTS_DASHBOARD
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    cards: path(ROOTS_DASHBOARD, '/user/card'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    customerlist: path(ROOTS_DASHBOARD, '/user/customerlist'),
    authorlist: path(ROOTS_DASHBOARD, '/user/authorlist'),
    editorlist: path(ROOTS_DASHBOARD, '/user/editorlist'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    useraccount: path(ROOTS_DASHBOARD, '/useraccount')
  },
  order: {
    detail: path(ROOTS_DASHBOARD, '/order/detail/:id'),
    buyerorderlist: path(ROOTS_DASHBOARD, '/order/buyerorderlist'),
    sellerorderlist: path(ROOTS_DASHBOARD, '/order/sellerorderlist'),
    neworder: path(ROOTS_DASHBOARD, '/order/neworder'),
  },
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics')
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
    labels: [
      path(ROOTS_DASHBOARD, '/mail/label/:customLabel/:mailId?'),
      path(ROOTS_DASHBOARD, '/mail/:systemLabel/:mailId?')
    ]
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: [
      path(ROOTS_DASHBOARD, '/chat/new'),
      path(ROOTS_DASHBOARD, '/chat/:conversationKey')
    ]
  }
};
