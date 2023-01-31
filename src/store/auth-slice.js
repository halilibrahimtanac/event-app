import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLogged: false,
  user: null,
  userEvents: null,
  participatedEvents: null,
  userFriends: null,
  pendingFriendReqs: [],
  pendingEventReqs: null,
  pendingJoinReqs: null,
  userNotifications: null,
  reports: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn(state, action) {
      state.user = action.payload.user;
      state.userEvents = action.payload.events;
      state.userNotifications = action.payload.notifications;
      state.userFriends = action.payload.friends.map((f) =>
        f.users.find((x) => x !== action.payload.user._id)
      );
      state.participatedEvents = action.payload.participated;
      state.pendingFriendReqs = action.payload.pendingFriends.map((p) => p.to);
      state.pendingJoinReqs = action.payload.pendingJoins;
      state.isLogged = true;
    },
    setReports(state, action) {
      state.reports = action.payload;
    },
    updateReports(state, action) {
      state.reports = state.reports.filter((x) => x._id !== action.payload);
    },
    addReport(state, action) {
      state.reports.push(action.payload);
    },
    addEvent(state, action) {
      state.userEvents.push(action.payload);
    },
    updateUser(state, action) {
      state.user = { ...action.payload, token: state.user.token };
    },
    removeFriend(state, action) {
      state.userFriends = state.userFriends.filter((x) => x !== action.payload);
    },
    updateEvent(state, action) {
      const index = state.userEvents.findIndex(
        (x) => x._id === action.payload._id
      );
      state.userEvents[index] = action.payload;
    },
    removeEvent(state, action) {
      state.userEvents = state.userEvents.filter(
        (x) => x._id !== action.payload
      );
    },
    logOut(state) {
      state.user = null;
      state.userEvents = null;
      state.userFriends = null;
      state.isLogged = false;
      localStorage.removeItem("user");
    },
    updateNotifies(state, action) {
      state.userNotifications = state.userNotifications.filter(
        (x) => x._id !== action.payload
      );
    },
    updateFriends(state, action) {
      state.userFriends.push(action.payload);
    },
    updatePendingJoinReqs(state, action) {
      state.pendingJoinReqs.push(action.payload);
    },
    updateFriendPendingReqs(state, action) {
      state.pendingFriendReqs.push(action.payload);
    },
  },
});

export const {
  logIn,
  setReports,
  updateReports,
  addReport,
  addEvent,
  removeEvent,
  updateUser,
  removeFriend,
  updateEvent,
  logOut,
  updateNotifies,
  updateFriends,
  updatePendingJoinReqs,
  updateFriendPendingReqs,
} = authSlice.actions;
export default authSlice.reducer;
