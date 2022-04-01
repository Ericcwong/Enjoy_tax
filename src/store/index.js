import { createApp } from "vue";
import { createStore } from "vuex";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      square: null,
    };
  },
  mutations: {
    updateSquare(state, payload) {
      state.square = payload;
    },
  },
});

export default store;
