# Wrenchcoach Master Cylinder Demo

## Getting started

### Install git lfs

### Install dependencies. 
  * Install yarn
  * Run `yarn install`


clone the following repositories

 * https://github.com/WrenchcoachInc/locator-item
 * https://github.com/WrenchcoachInc/dom-label
 * https://github.com/WrenchcoachInc/socket-and-plug

 in each repo, build by calling 'yarn build'

 then 'yarn link'

 then in this repo

 'yarn link @wrenchcoach/locator-item'
 'yarn link @wrenchcoach/dom-label'
 'yarn link @wrenchcoach/socket-and-plug'

 
## Running

run the server. 

Launch the various pages.
 * http://127.0.0.21:8080/?stage=identification
 * http://127.0.0.21:8080/?stage=simulation
 * http://127.0.0.21:8080/?stage=assembly


