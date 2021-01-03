## What's this?
This is the basis for a local development server that MetaExplorer-UIs can connect to

## What does it do?
It contains a number of helpers to initialize default behaviour for a development server.

## Features
- use the `NOCODE_BLOCKS_PATH` environment variable to set the path where your initial blocks are in. They will be copied to the editor-server's internal folder structure every time you start the server
- use `DEV_NOCODE_FOLDER` to set the name of your working directory. It will appear once you run the server
- use `DYN_USER_CSS_FOLDER` to set the name of the folder where you keep your styles. Will be a subfolder of `DEV_NOCODE_FOLDER`

- to save data to the server before you have a working endpoint, use `http://localhost:5000/api/globals`. It accepts GET and POST and will save the data it receives in `globals.json`
- a GET to `http://localhost:5000/api/blocks` will retrieve all interpreters. A POST will save a single InterpreterRefMap-formatted json to the folder relative to its `nameself` value (i.e. blocks in the designer get saved in the right subfolder)