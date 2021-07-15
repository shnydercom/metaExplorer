# Introduction-Video
https://youtu.be/iJUnQRw52Ds

### ...and here you can build your own App with the POC:
[metaExplorer starter template](https://github.com/shnydercom/metaexplorer-starter)

# Vision
MetaExplorer aims to build user interfaces that adapt to different people and circumstances. These people can be the end-users or your team members, who solve a user's problem. MetaExplorer aims to build a general human-machine interface that can interact with different devices, operating systems and individual needs of a person.

It is inspired by the communities who share and combine complex technical work. Namely blender3D, node-red, the numerous 3D printing communities and creators of many software development frameworks.

# How does it work?
- every re-usable part gets a URL, based on schema.org
- type-checks happen with URLs as types
- synchronous state is modeled as a Directed Acyclic Graph, asynchronous state updates (side effects) can be any graph
- data is modeled in 'any graph', described in JSON-LD
- existing JSON doesn't have to change, with JSON-LD's @context, variables can migrate their full domain (so a Button becomes a mydomain.com/Button and can change into an example.com/Button or a localhost/Button)
- if it's clear which Button-type is meant, a UI component or other code can be run after getting it from a _Retriever_
- if there is more than one possible option, or to change the UI after the @context has changed, a _Matcher_ can choose from multiple _Retrievers_

And that's about it. This approach is independent of UI frameworks, since it works on data and the descriptive names we give to parts of that data. The names go into a generalized vocabulary, but stay locally modifyable. Unlike most content management systems and nocode-tools, the UI data can be saved both in git or in a database.

# Proof of Concept
The proof of concept was started as UI tech for [hydra](http://www.hydra-cg.com/) APIs. Slowly GraphQL has taken over, and now that I've worked with REST, GraphQL and websockets I want something that's independent of that to the backend, and similarly independent to the frontend. The POC contains a node-editor similarly to blender's, but you can crash it by creating a cyclic graph. It updates everything asynchronously, which puts a limit to performance. The page at [metaexplorer.io](https://metaexplorer.io) was created with the POC, and so you can try out the performance of that approach.

# License
This project was started in Europe, therefore we chose the EUPL license. It's compatible with a lot of other Open Source licenses and fit for commercial use. More info:
- https://en.wikipedia.org/wiki/European_Union_Public_Licence
- https://joinup.ec.europa.eu/collection/eupl/eupl-guidelines-faq-infographics
- https://joinup.ec.europa.eu/sites/default/files/inline-files/EUPL%201_1%20Guidelines%20EN%20Joinup.pdf

## Why this license?
Which license(s) you choose for add-ons to MetaExplorer under your domain should be up to you. It's only important for open source projects that overall improvements to the core technology stay open.