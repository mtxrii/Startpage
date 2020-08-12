<template>
  <div id="app">

    <p class="title is-3">Welcome back, {{name}}</p>
    <p class="subtitle is-3">{{time}}</p>

    <b-button id="editIcon" type="is-dark" icon-right="circle-edit-outline" @click="openNameSettings" />

    <div class="columns">
      <div class="column">github and weather</div>
      <div class="column is-two-fifths">tiles</div>

      <div class="column">
        <div v-for="(i, n) in todo" v-bind:item="i" v-bind:index="n" v-bind:key="i.id">
          <b-tag size="is-medium">{{i}}</b-tag>
          <b-button size="is-small" icon-right="check-all" @click="removeTodo(n)"></b-button>
          <br>
        </div>

        <p>
          <b-field>
            <b-input v-model="newTodo"></b-input>
            <b-button @click="addTodo">Add Todo</b-button>
          </b-field>
        </p>
      </div>
    </div>


  </div>
</template>

<script>

export default {
  name: 'App',
  components: {},

  data: function() {
    return {
      name: 'User',
      github: '',
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
    saveName(newName) {
      this.name = newName;
      localStorage.name = newName;
    },

    saveGithub(newGit) {
      this.github = newGit;
      localStorage.github = newGit;
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

    openNameSettings() {
      this.$buefy.dialog.prompt({
        message: "Change Name",
        inputAttrs: {
          type: "text",
          placeholder: "Name",
          value: this.name
        },
        onConfirm: (value) => this.saveName(value)
      })
    },

    openGitSettings() {
      this.$buefy.dialog.prompt({
        title: "Change Github Username",
        message: "Uses this to check for daily commit.",
        inputAttrs: {
          type: "text",
          placeholder: "Username",
          value: this.github
        },
        onConfirm: (value) => this.saveGithub(value)
      })
    }
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
  margin-top: 30px;
}

#editIcon {
  position: absolute;
  top: 15px;
  right: 15px;
}
</style>
