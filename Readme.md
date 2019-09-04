# Installation

- run `yarn bootsrap`
- run `yarn build`

# running with the development server

- run `yarn start`

the development server saves your blocks under "packages/editor-dev-server/dev-srv-nocode/blocks"
you can load a stylesheet depending on the username of your main interpreter. This would be located under "WEB_ROOT/styles/username-style.css", or if you're using the editor-dev-server, put it under "packages/editor-dev-server/dev-srv-nocode/styles/username-style.css"

# creating your own app

- cd into `packages/metaexplorer.io`
- run `yarn buildcra` to execute create-react-app / react-scripts, which will create a build folder in that sub-project
- create your own repository/folder
- copy `packages/metaexplorer.io/build` into your repository's web root
- copy `packages/metaexplorer.io/assets` into `media` under your repository's web root
- copy `packages/editor-dev-server/dev-srv-nocode/interpreters.json` into `/api-static/interpreters.json` under your repository's web root
- open `/api-static/interpreters.json` and search for `mainItpt`, the part before the first `/` is your username, and this is the main entrypoint that will be displayed first
- use your username to create a `styles/yourusername-style.css` file under your repository's web root
- run it with your favorite web server

# license

The EUPL license applies. It's compatible with a lot of other Open Source licenses and fit for commercial use. More info:
- https://en.wikipedia.org/wiki/European_Union_Public_Licence
- https://joinup.ec.europa.eu/collection/eupl/eupl-guidelines-faq-infographics
- https://joinup.ec.europa.eu/sites/default/files/inline-files/EUPL%201_1%20Guidelines%20EN%20Joinup.pdf