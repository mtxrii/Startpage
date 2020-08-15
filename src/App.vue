<template>
  <div id="app">

    <p class="title is-3">Welcome back, {{name}}</p>
    <p class="subtitle is-3">{{time}}</p>

    <b-button id="editIcon1" type="is-dark" icon-right="account-edit" @click="openNameSettings" />
    <b-button id="editIcon2" type="is-dark" icon-right="github" @click="openGitSettings" />

    <div class="columns">
      <div class="column"> <!-- (1) github & weather -->
        <div>
          <p class="title is-5">Today's Github commit</p>
          <div v-if="commit" class="commit full"></div>
          <div v-else class="commit"></div>
        </div>

        <br>
        <br>

        <div>
          <p class="title is-5">Weather</p>
          <p class="subtitle is-6"><b-icon icon="map-marker" size="is-small"></b-icon> {{city}}</p>

          <figure style="margin-top: -30px; margin-bottom: -5px">
            <img :src="weather.icon">
          </figure>

          <p>Max: <strong>{{weather.max}}</strong>  Min: <strong>{{weather.min}}</strong></p>
          <p>Feels like: <strong>{{weather.feels_like}}</strong></p>
          <p>Humidity: <strong>{{weather.humidity}}</strong></p>
        </div>
      </div>

      <div class="column is-two-fifths"> <!-- (2) bookmark tiles -->
        tiles
      </div>

      <div class="column"> <!-- (3) todo list -->
        <div v-for="(i, n) in todo" v-bind:item="i" v-bind:index="n" v-bind:key="i.id" style="text-align: left;">
          <b-button size="is-small" icon-right="check-outline" @click="removeTodo(n)"></b-button>
          <b-tag size="is-medium">{{i}}</b-tag>
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

      time: '',
      commit: false,

      city: 'loading...',
      weather: {
        icon: '',
        max: '',
        min: '',
        feels_like: '',
        humidity: ''
      }
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
    this.isThereACommitToday();
    this.getIP();
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
    },

    isThereACommitToday() {
      if (this.github == '') {
        this.commit = false;
        return;
      }
      const today = new Date();
      const date = today.getFullYear() + "-" + this.zeroPadding((today.getMonth() + 1), 2) + "-" + this.zeroPadding(today.getDate(), 2);
      fetch("https://api.github.com/search/commits?q=author:" + this.github + "+author-date:" + date + "&per_page=1", {
          headers: {
              Accept: "application/vnd.github.cloak-preview"
          }
      }).then(response => response.json())
        .then(data => {this.commit = (data.total_count != 0)});
    },

    getIP() {
      fetch("https://api.ipify.org/?format=json")
        .then(response => response.json())
        .then(data => this.getCity(data.ip));
    },

    getCity(ip) {
      fetch("http://ip-api.com/json/" + ip)
        .then(response => response.json())
        .then(data => {
          this.city = data.city;
          this.loadWeather();
        });
    },

    loadWeather() {
      const cityName = this.city.split(" ").join("+");
      const weatherKey = this.$keyVars.OpenWeatherMap;
      fetch("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + weatherKey)
        .then(response => response.json())
        .then(data => {
          this.weather.icon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
          this.weather.max = this.KtoF(data.main.temp_max);
          this.weather.min = this.KtoF(data.main.temp_min);
          this.weather.feels_like = this.KtoF(data.main.feels_like);
          this.weather.humidity = data.main.humidity;
        });
    },

    KtoF(degrees) {
      degrees = parseFloat(degrees);
      return ((((degrees-273.15)*1.8)+32) + "").slice(0, 4);
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

#editIcon1 {
  position: absolute;
  top: 15px;
  right: 15px;
}

#editIcon2 {
  position: absolute;
  top: 15px;
  right: 55px;
}

.commit {
  border: 5px solid rgba(164,164,164);
  border-radius: 20px;
  background-color: rgb(235, 237, 240);
  display: inline-block;
  height: 100px;
  width: 100px;
}

.commit.full {
  background-color: rgb(155, 233, 168);
}
</style>
