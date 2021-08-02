# thairod-medic-register

medical personnel registration for Thairod project

[![Main](https://github.com/feiwaz/thairod-medic-register/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/feiwaz/thairod-medic-register/actions/workflows/main.yaml)

## Local Development Steps

### Prerequisites

1. Docker + Docker Compose
2. VSCode
3. NodeJS 14 LTS

Working Directory: root folder

### Step

### 1. Start Local development environment by docker-compose

1. run `docker-compose up` in root folder to start mysql cluster and other development environment
2. mysql cluster able to access with the informatioon below

- HOST: `localhost`
- PORT: `3307`
- USER: `mysql`
- password: `password`

> Tip: Troublshooting in any case of issue please delete `tmp` folder and retry from step 1)

### 2. Start Backend

1. `cd backend`
2. `npm install` to restore node packages
3. `npm run start:debug` to start backend (API) at port 3000
4. press `F5` or run debug name `Debug Backend` to attach debugging process for breakpoint debugging

> Note: Backend configuration loadded via .env file located in `backend/.env`

### 3. Start Frontend

1. `cd frontend`
2. `npm install` to restore node packages
3. `npm run start` to start frontend at port 4200
4. all of http request with prefix `api/*` will be proxy to port 3000
