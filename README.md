# DOTSC-NodeJS-StarterKit
WARNING: Cloned from GRIT, will make modifications for this soon!

## Components
- MS Sql Server
- Node Js Server
- React Js
- Semantic-React UI
- React Router

## Packages Used
- express
- mssql
- socket.io
- winston
- react
- react-dom
- axios
- semanitc-ui-react
- react-transition-group
- semantic-ui-css

## Deployement Procedure
*subject to change in the future*
1. Deploy database changes via publishing tool.
2. Config **.\GRIT\GRIT-Project\GRIT-Server\main-server-conf.json** (see example if one doesn't exist)
3. Config **.\GRIT\GRIT-Project\GRIT-Server\SqlServer\serverConfig.json**
4. Config **.\GRIT\GRIT-Project\GRIT-UI\public\scripts\config.js** (make sure this port matches main server config)
5. Config **.\GRIT\GRIT-Project\grit-start.json** (make sure this port matches main server config & static server config)
5. update packages in **.\GRIT\GRIT-Project\GRIT-UI** cmd: `npm install`
6. update packages in **.\GRIT\GRIT-Project\GRIT-Server** cmd: `npm install`
7. start node server in **.\GRIT\GRIT-Project\GRIT-Server** cmd: `node server`
8. start resct js in **.\GRIT\GRIT-Project\GRIT-UI** cmd: `npm start`

## React build process
*in **GRIT-UI** folder*
1. run: `npm run build`
2. install: `npm install -g serve`
 - *test: `serve -s build`*
3. run: `pm2 serve build 5000`
  - (optional) `pm2 start npm -- start`
  
## Integration Procedure
*Work in progress*
1. install pm2 `npm install pm2 -g`
2. TODO: create automated confg file
  - pm2 start server.js << for now...
3. install windows service, point to PM2 home `npm i pm2-windows-service -g`
  - TODO: create env variables for service.
4. `pm2 monit` << to check on stuff
5. `pm2 list` << quick rundown of all processes.
