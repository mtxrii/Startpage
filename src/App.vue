<template>
  <div id="app">

    <br>
    <p class="title is-3">Welcome back, {{name}}</p>
    <p class="subtitle is-3">{{time}}</p>

    <b-button id="editIcon1" type="is-dark" icon-right="account-edit" @click="openNameSettings" />
    <b-button id="editIcon2" type="is-dark" icon-right="github" @click="openGitSettings" />

    <section class="section">
      <div class="container">
        <div class="columns">

          <div class="column"> <!-- (1) github & weather -->
            <div class="card transparent">
              <div class="card-content">
                <p class="title is-5">Today's Github commit</p>
                <div v-if="commit" class="commit full"></div>
                <div v-else class="commit"></div>
              </div>
            </div>

            <br>
            <br>

            <div class="card transparent">
              <div class="card-content">
                <p class="title is-5">Weather</p>
                <p class="subtitle is-6"><b-icon icon="map-marker" size="is-small"></b-icon> {{city}}</p>

                <figure style="margin-top: -30px; margin-bottom: -5px">
                  <img :src="weather.icon">
                </figure>

                <p>Max: <strong>{{weather.max}}</strong>  Min: <strong>{{weather.min}}</strong></p>
                <p>Feels like: <strong>{{weather.feels_like}}</strong></p>
                <p>Humidity: <strong>{{weather.humidity}}%</strong></p>
              </div>
            </div>
          </div>

          <div class="column is-two-fifths"> <!-- (2) bookmark tiles -->
            <div class="columns is-mobile is-multiline is-centered">

              <div class="column is-narrow">
                <a @click="openNewLinkMenu()">
                  <div class="card transparent">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-32x32" style="padding-top: 3px">
                            <img src="./assets/icon_plus.png" alt="plus icon">
                          </figure>
                        </div>
                        <div class="media-content">
                          <p class="title is-6" style="padding-top: 9px; padding-bottom: 9px">Add Link</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              <div class="column is-narrow" v-for="(i, n) in links" v-bind:item="i" v-bind:index="n" v-bind:key="i.id">
                <a :href="i.href">
                  <div class="card transparent">
                    <div class="card-content">
                      <div class="media">
                        <div class="media-left">
                          <figure class="image is-32x32" style="padding-top: 3px">
                            <img :src="'https://favicons.githubusercontent.com/'+domainStrip(i.href, false)" alt="site icon">
                          </figure>
                        </div>
                        <div class="media-content">
                          <p class="title is-6">{{i.name}}</p>
                          <p class="subtitle is-7">{{domainStrip(i.href, true)}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
              
            </div>
          </div>

          <div class="column"> <!-- (3) todo list -->
            <div class="card transparent">
              <div class="card-content">
                <div v-for="(i, n) in todo" v-bind:item="i" v-bind:index="n" v-bind:key="i.id" style="text-align: left;">
                  <b-button rounded style="margin-top: 2px; margin-right: 2px" size="is-small" icon-right="check-outline" @click="removeTodo(n)"></b-button>
                  <b-tag size="is-medium">{{i}}</b-tag>
                  <div style="padding-top: 5px"></div>
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

        </div>
      </div>
    </section>
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
      links: [],

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

    if (localStorage.getItem('links')) {
      try {
        this.links = JSON.parse(localStorage.getItem('links'));
      } catch(e) {
        localStorage.removeItem('links');
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

    addLink(newLink, linkName) {
      if (!newLink || !linkName) return;

      this.links.push({
        name: linkName,
        href: newLink
      });
      this.saveLinks();
    },

    removeTodo(x) {
      this.todo.splice(x, 1);
      this.saveTodo();
    },

    removeLink(x) {
      this.links.splice(x, 1);
      this.saveLinks();
    },

    saveTodo() {
      const parsed = JSON.stringify(this.todo);
      localStorage.setItem('todo', parsed);
    },

    saveLinks() {
      const parsed = JSON.stringify(this.links);
      localStorage.setItem('links', parsed);
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

    openNewLinkMenu() {
      this.$buefy.dialog.prompt({
        message: "New bookmark",
        inputAttrs: {
          type: "text",
          placeholder: "link"
        },
        onConfirm: (linkTxt) => this.$buefy.dialog.prompt({
          message: "Name for bookmark",
          inputAttrs: {
            type: "text",
            placeholder: "name"
          },
          onConfirm: (nameTxt) => this.addLink(linkTxt, nameTxt)
        })
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
    },

    domainStrip(txt, includePath) {
      txt = txt.replace('https://www.', '');
      txt = txt.replace('http://www.', '');
      if (includePath) {
        return txt;
      }
      else {
        return txt.split("/")[0];
      }
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

.card.transparent {
  background-color: rgba(255, 255, 255, 50%);
}
</style>
