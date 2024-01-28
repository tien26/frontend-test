// import auth from "./auth";
import { createRouter, createWebHashHistory } from "vue-router";
import Cookie from 'js-cookie'

import Home from "./views/home-page";
import Profile from "./views/profile-page";
import Tasks from "./views/tasks-page";
import defaultLayout from "./layouts/side-nav-outer-toolbar";
import simpleLayout from "./layouts/single-card";

// layout user
import userLayout from "./layouts/side-nav-outer-toolbar-user";

// car
import CarListAdmin from "./views/admin/carListView";
import carListFormAdmin from "./views/admin/formCarListView";
import CarLoanAdmin from "./views/admin/carLoanView";
import BorrowingHistoryAdmin from "./views/admin/borrowingHistoryView";

// user
import CarListUser from "./views/user/carListView";
import CarLoanUser from "./views/user/carLoanView";
import FormCarLoanUser from "./views/user/formLoanView";

function loadView(view) {
  return () => import(/* webpackChunkName: "login" */ `./views/${view}.vue`)
}

const router = new createRouter({
  routes: [
    {
      path: "/home",
      name: "home",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Home
    },
    {
      path: "/profile",
      name: "profile",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Profile
    },
    {
      path: "/tasks",
      name: "tasks",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: Tasks
    },

    // route car
    {
      path: "/car-list",
      name: "carListAdmin",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: CarListAdmin
    },
    {
      path: "/car-list/form",
      name: "carListFormAdmin",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: carListFormAdmin
    },
    {
      path: "/car-loan",
      name: "carLoanAdmin",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: CarLoanAdmin
    },
    {
      path: "/borrowing-history",
      name: "borrowingHistoryAdminAdmin",
      meta: {
        requiresAuth: true,
        layout: defaultLayout
      },
      component: BorrowingHistoryAdmin
    },

    // // user
    {
      path: "/user/home",
      name: "homeUser",
      meta: {
        requiresAuth: true,
        layout: userLayout
      },
      component: Home
    },
    {
      path: "/user/car-loan",
      name: "carLoanUser",
      meta: {
        requiresAuth: true,
        layout: userLayout
      },
      component: CarLoanUser
    },
    {
      path: "/user/car-list",
      name: "carListUser",
      meta: {
        requiresAuth: true,
        layout: userLayout
      },
      component: CarListUser
    },
    {
      path: "/user/car-loan/form",
      name: "FormCarLoanUser",
      meta: {
        requiresAuth: true,
        layout: userLayout
      },
      component: FormCarLoanUser
    },




    {
      path: "/",
      name: "login-form",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Sign In"
      },
      component: loadView("login-form")
    },
    {
      path: "/reset-password",
      name: "reset-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Reset Password",
        description: "Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
      },
      component: loadView("reset-password-form")
    },
    {
      path: "/create-account",
      name: "create-account",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Sign Up"
      },
      component: loadView("create-account-form"),
    },
    {
      path: "/change-password/:recoveryCode",
      name: "change-password",
      meta: {
        requiresAuth: false,
        layout: simpleLayout,
        title: "Change Password"
      },
      component: loadView("change-password-form")
    },
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: "/recovery",
      redirect: "/login"
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login"
    }
  ],
  history: createWebHashHistory()
});

router.beforeEach((to, from, next) => {

  const token = Cookie.get('token');
  const rl = Cookie.get('rl');

  if (to.meta.requiresAuth) {
    if (!token) {
      next({ name: "login-form" })
    } else {
      let tokenData = token.split(".")[1];
      const decode = JSON.parse(atob(tokenData));
      const now = new Date().getTime() / 1000;
      if (decode.exp < now) {
        Cookie.remove('token')
        next({ name: "login-form" })
        return
      }
    }
    next()
  } else if (!to.meta.requiresAuth && token) {
    next({ name: "home" })
  }
  else {
    next()
  }
});

export default router;
