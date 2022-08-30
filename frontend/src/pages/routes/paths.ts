// ----------------------------------------------------------------------

function path(root: string, sublink: string) {
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
  verify: path(ROOTS_AUTH, '/verify'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    production: path(ROOTS_DASHBOARD, '/production'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    conversation: path(ROOTS_DASHBOARD, '/chat/:conversationKey'),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  user: {
    root: path(ROOTS_DASHBOARD, '/members'),
    profile: path(ROOTS_DASHBOARD, '/members/profile'),
    cards: path(ROOTS_DASHBOARD, '/members/cards'),
    list: path(ROOTS_DASHBOARD, '/members/list'),
    newUser: path(ROOTS_DASHBOARD, '/members/new'),
    account: path(ROOTS_DASHBOARD, '/members/account'),
    manage: path(ROOTS_DASHBOARD, '/members/manage'),
  },
  assets: {
    list: path(ROOTS_DASHBOARD, '/assets/list'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/assets'),
    shop: path(ROOTS_DASHBOARD, '/assets/shop'),
    checkout: path(ROOTS_DASHBOARD, '/assets/checkout'),
    invoice: path(ROOTS_DASHBOARD, '/assets/invoice'),
    newNFT: path(ROOTS_DASHBOARD, '/assets/nft/new'),
    editNFT: path(ROOTS_DASHBOARD, '/assets/nft/:name'),
    transferNFTs: path(ROOTS_DASHBOARD, '/assets/product/transfer/:name'),

    allListings: path(ROOTS_DASHBOARD, '/assets/listing/all'),
    myListings: path(ROOTS_DASHBOARD, '/assets/listing/my'),
    newListing: path(ROOTS_DASHBOARD, '/assets/listing/new'),
    listing: path(ROOTS_DASHBOARD, '/assets/listing'),

    allAgreements: path(ROOTS_DASHBOARD, '/assets/agreement/all'),
    newAgreement: path(ROOTS_DASHBOARD, '/assets/agreement/new'),
    agreements: path(ROOTS_DASHBOARD, '/assets/agreement'),

    allCollections: path(ROOTS_DASHBOARD, '/assets/collection/all'),
    newCollection: path(ROOTS_DASHBOARD, '/assets/collection/new'),
    collections: path(ROOTS_DASHBOARD, '/assets/collection'),
  },
  earnings: {
    root: path(ROOTS_DASHBOARD, '/earnings'),
    allEarnings: path(ROOTS_DASHBOARD, '/earnings/total'),
  },
  balances: {
    root: path(ROOTS_DASHBOARD, '/balances'),
    allBalances: path(ROOTS_DASHBOARD, '/balances/total'),
  },
  reviews: {
    root: path(ROOTS_DASHBOARD, '/reviews'),
    allReviews: path(ROOTS_DASHBOARD, '/reviews/total'),
  }
};