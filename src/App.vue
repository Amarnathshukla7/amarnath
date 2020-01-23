<template>
  <div id="app">
    <room-view></room-view>
  </div>
</template>

<script>
import RoomView from "./components/room/RoomView.vue";

export default {
  name: "app",
  components: {
    RoomView
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
