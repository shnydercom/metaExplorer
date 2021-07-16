# Getting started quickly

If you want to get started quickly, use the [metaExplorer starter template](https://github.com/shnydercom/metaexplorer-starter)

# Introduction

> Graphql has a schema, databases have schemas, why not have one for the frontend?

MetaExplorer is a Proof of Concept for an integrated frontend development experience to achieve exactly that. Between design-tools and API-calls us developers are fulfilling the wishes of clients, product managers, designers, backenders and many more stakeholders. We can already hot-reload our projects so they can see code changes in an instant, but what if we could hand a visual editor to the designer, and a graphql editor to the backender? Then it would be nice to have a tool for ourselves to create the connection between the two, copy/pasting standard UX. And only after that we'd write custom code.
![metaexplorer connecting framer sketch and graphql](/proof-of-concept/docs/media/readme-mxp-connecting.jpg)
## How is that achieved? 
JSON, inputs and outputs in a graph, plus some types. 
## An example
Let's say we get a https://schema.org/Boolean type from the API, then we could display a checkbox or a switch in the frontend. 

If the data comes formatted as markdown we could display a richtext-editor or a markdown-to-html-converter component, depending on if we want to create/update data or read it.

And if we receive a type like https://schema.org/Restaurant we can tell MetaExplorer to automatically choose a checkbox or switch for the https://schema.org/acceptsReservations property. These concepts are inspired by work around the semantic web, which means:

> Metaexplorer is built on the concept that the whole internet is a graph/web of data and you can surf it with an explorer, giving you a personalized experience

# Current state of development

You can already use MetaExplorer to build a Single Page Application with React and Redux. Visual Components from Material UI, components for Barcode/QR-Code scanning and generation exist, as well as a graphql-generator and richtext editor is currently in development. The whole website of https://metaexplorer.io is a showcase of what MetaExplorer is capable of.

# Installation

- run `yarn bootsrap`
- run `yarn build`

# Running with the development server

- run `yarn start`

the development server saves your blocks under "packages/editor-dev-server/dev-srv-nocode/blocks"
you can load a stylesheet depending on the username of your main interpreter. This would be located under "WEB_ROOT/styles/username-style.css", or if you're using the editor-dev-server, put it under "packages/editor-dev-server/dev-srv-nocode/styles/username-style.css"

# Creating your own app - old flow

- cd into `packages/metaexplorer.io`
- run `yarn buildcra` to execute create-react-app / react-scripts, which will create a build folder in that sub-project
- create your own repository/folder
- copy `packages/metaexplorer.io/build` into your repository's web root
- copy `packages/metaexplorer.io/assets` into `media` under your repository's web root
- copy `packages/editor-dev-server/dev-srv-nocode/interpreters.json` into `/api-static/interpreters.json` under your repository's web root
- open `/api-static/interpreters.json` and search for `mainItpt`, the part before the first `/` is your username, and this is the main entrypoint that will be displayed first
- use your username to create a `styles/yourusername-style.css` file under your repository's web root
- run it with your favorite web server

# License

The EUPL license applies. It's compatible with a lot of other Open Source licenses and fit for commercial use. More info:
- https://en.wikipedia.org/wiki/European_Union_Public_Licence
- https://joinup.ec.europa.eu/collection/eupl/eupl-guidelines-faq-infographics
- https://joinup.ec.europa.eu/sites/default/files/inline-files/EUPL%201_1%20Guidelines%20EN%20Joinup.pdf
