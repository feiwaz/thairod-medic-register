# thairod-medic-register

medical personnel registration for Thairod project

[![Main](https://github.com/feiwaz/thairod-medic-register/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/feiwaz/thairod-medic-register/actions/workflows/main.yaml)

## Local Development Steps

Tool: VSCode

NodeJS: Version 14 LTS

Working Directory: root folder

### A. Start Backend

1. `cd backend`
2. `npm install` to restore node packages
3. `npm run start:debug` to start backend (API) at port 3000
4. press `F5` or run debug name `Debug Backend` to attach debugging process for breakpoint debugging

### B. Start Frontend

1. `cd frontend`
2. `npm install` to restore node packages
3. `npm run start:debug` to start frontend at port 4200
4. all of http request with prefix `api/*` will be proxy to port 3000
