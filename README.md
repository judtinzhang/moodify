# moo-dify

Instructions to build project locally:
 - Clone repository: https://github.com/judtinzhang/moodify 
 - `cd` into repository
 - Run `npm install` to install dependencies
 - Run `npm run dev` to run both the frontend and backend
 - Navigate to http://localhost:1234/ to begin!

Note the code used for cleaning/wrangling is in `wrangling.ipynb` and the list of dependencies is in `package.json`.


This project will translate the user's text in the following ways:
- emotions: converts text to embody specifed emotion
  - anticipation, disgust, fear, joy, sadness, surprise, trust
- sentiment: converts text to embody specified sentiment
  - positive, negative
- languages: converts text to a specified language (103 possible languages to choose from)
- poetify: converts text in a way to capture the feeling of a sentence with no concern for meaning 😇
  - replaces every word with another word of the same sentiment and emotion

We will also display statistics regarding how positive and negative the database is and the percentage of each emotion in the translated text.

### Developers
Jason Yan, Justin Zhang, Sara Xin, Hetvi Shah

*Note*: The commits are not reflective of individual work. We Liveshared and worked on the app together.

### Data

We use the [NRC Emotion Lexicon](https://saifmohammad.com/WebPages/NRC-Emotion-Lexicon.htm) dataset and [WordNet](https://www.kaggle.com/duketemon/wordnet-synonyms/version/2) database by Princeton University. The former maps English words to an emotion, sentiment, translated language, etc. The latter maps a word to its part of speech and synonym.

### Directory Navigation

Our project contains a `backend` and a `frontend` directory, which correspond to our server and client, respectively. 

Within the `frontend` directory, we have a React-based app. The majority of our code rests in `src/components` as well in `src/App.js` and `src/fetcher.js`. `fetcher.js` contains the API requests to the backend, and other files serve as the client for users to interact with. We currently have two pages, `Home.js` and `Results.js`.

Within the `backend` directory, we have an Express/Node.js based app. We have two files, `server.js`, which enables `express`, several middlewares, and routers. The primary code rests in `routes.js`, which connects the backend to the database as well as sends queries to the database.  The backend contains several API routes, as well as modular, reusable functions to interact with the database on a word-to-word basis. The configurations for our database are in the `backend/config.json` file.

Our wrangling file, to clean the data, is located in the root directory as a .ipynb file.

Lastly, the configurations to install the necessary packages are listed in `package.json`. Run `npm install` to download all the dependencies.
