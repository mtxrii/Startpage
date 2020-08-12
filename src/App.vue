<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <p>
      My name is <input v-model="name">
    </p>
    <p>
      <button @click="persist">Save</button>
    </p> -->

    <p class="title is-3">Welcome back, {{name}}</p>
    <p class="subtitle is-3">{{time}}</p>






  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},

  el: '#app',

  data: function() {
    return {
      name: 'User',
      github: 'exampleUsername',
      todo: [],
      newTodo: null,

      time: ''
    }
  },

  beforeMount() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },

  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
    if (localStorage.github) {
      this.github = localStorage.github;
    }
    if (localStorage.getItem('todo')) {
      try {
        this.todo = JSON.parse(localStorage.getItem('todo'));
      } catch(e) {
        localStorage.removeItem('todo');
      }
    }
  },

  methods: {
    persist() {
      localStorage.name = this.name;
      localStorage.github = this.github;
    },

    addTodo() {
      if (!this.newTodo) return;

      this.todo.push(this.newTodo);
      this.newTodo = '';
      this.saveTodo();
    },

    removeTodo(x) {
      this.todo.splice(x, 1);
      this.saveTodo();
    },

    saveTodo() {
      const parsed = JSON.stringify(this.todo);
      localStorage.setItem('todo', parsed);
    },

    zeroPadding(num, digit) {
      var zero = '';
      for(var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },

    updateTime() {
      let cd = new Date();
      if (cd.getHours() > 12) {
        this.time = this.zeroPadding(cd.getHours() - 12, 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2) + " PM";
      }
      else {
        this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2) + " AM";
      }
    },
  },

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
