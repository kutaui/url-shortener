<div align="center">
<h1>Thought Pocket</h1>

[Live](https://shortie.kutaybekleric.com)

<h3>A URL shortening service with analytics and real-time notifications</h3>
</div>

![Landing Page](./frontend/public/dashboard.png)

# Introduction

URL shortening service with analytics and real-time notifications. Using Golang's standard library for the backend and Next.js for the frontend. Used caching, sorting, and drag and drop features to enhance the user experience.

## Tech Stack

- Next.js
- Typescript
- Tanstack Query
- TailwindCSS
- shadcn/ui
- Recharts
- dnd-kit
- Golang
- PostgreSQL
- Redis
- Server Sent Events
- Docker

## Features

- <b>JWT Authentication</b> <br>

Saving the JWT as a HTTP only cookie.

- <b>Server Sent Events</b> <br>

When one of the links created by the logged in user is clicked, a notification is sent to the frontend then it is displayed as a toast.

- <b>Redis Caching</b> <br>

I kept the Redis logic simple, currentşy if a link is clicked more than _X_ amount of times it is saved in the redis to retrieve it faster since it is being clicked "a lot".

- <b>Resizable Sidebar</b> <br>

Sidebar can be resized and shrunk.

- <b>Drag and Drop</b> <br>

You can sort your analytic charts in the dashboard according to your preference, the order persists on local storage.
