This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This is a playground for experimenting with realtime sync found in a [React Helsinki 2020 Presentation by Tuomas Artman](https://www.youtube.com/live/WxK11RsLqp4?feature=share&t=2175). **Nothing here is production ready.**

It is currently deployed to Vercel at https://sync-play-gamma.vercel.app.

## Features

When a payment status is updated, a PATCH is send to the server, which after updating, pushes a websocket event to call connected clients which in turn, update their local state.

Payments with `sender`s having an `@yahoo.com` address will not update on their server. When you edit their status, it will flicker due to optimisic UI updates reseting.

Most of the functionality can be found in [/src/models.ts](/src/models.ts).

### TODO:

I would like to continue working on the models, perhaps by adding the `@ManyToOne` and `@OneToMany` associations as showin in the presentation.

I would also like to store the application state in IndexedDB, rather than rebuilding it on every page load.
