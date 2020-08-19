# Translucent Startpage
A simple bookmark launchpad with some other utilities.

<img src="src/assets/preview_1.gif" width="90%">

### Features
* Add your bookmarks front & center.
* Github commit box lights up if you've commited something to Github today.
* Shows you today's weather, automatically localized.
* Simple and lightweight To-do list on the right.

### Cuztomization
Only requires specification of your preferred name & Github username. Username is used for [Github search API](https://docs.github.com/en/github/searching-for-information-on-github/searching-commits) and name is only used for the greeting message.

All data is saved in your browser's localStore. This means your name & username, as well as any bookmarks and to-do items are never sent anywhere. There is no backend or database.

### Libraries & APIs
* App written in [Vue.js](https://vuejs.org/)
* Daily commit checked with [Github Search API](https://docs.github.com/en/github/searching-for-information-on-github/searching-commits)
* Weather provided by [Open Weather Map](https://openweathermap.org/)
* Location (for weather) retrieved using [IP API](https://ip-api.com/docs/api:json)
* Favicons fetched from [Github favicon database](https://favicons.githubusercontent.com/reddit.com)

### Editing
Want to modify this project? You'll need to download NPM & VueJS. To make edits, fork & clone, then do `npm install` & `npm run serve`

If you want to use the weather component, you'll need an [Open Weather Map](https://openweathermap.org/) API key. Make a new file inside ./src/ named `keys.js` and fill it in like such:

```
export const keys = {
    OpenWeatherMap: 'PASTE API KEY HERE'
}
```

### License
[MIT](https://github.com/mtxrii/Startpage/blob/master/LICENSE.md)

### WTF is a startpage?
Tired of the boring default new-tab page in Chrome? Create your own web page with whatever you want on it! (this is mine, for example) Or use a pre-existing one (there's a [subreddit](https://www.reddit.com/r/startpages/) full of them.) Then link your new-tab default page to it.
