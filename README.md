# YumPOS V2 - UI

### Installation

```bash
$ npm install
```

### Local

```bash
$ npm run start
```

### Production

```bash
$ npm run build

$ serve -s build
```

On Production with **pm2**

```bash
$ pm2 serve build 3001 --spa --name=ui
```

### Env File

```
REACT_APP_PUBLIC_API_KEY=API_KEY
REACT_APP_PUBLIC_BASE_URL=http://api.url
```
