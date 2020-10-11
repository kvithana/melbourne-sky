# Melbourne Sky

A little experiment to show the colour of the Melbourne sky. Inspired by a website I saw on Twitter but I can't seem to find it anymore 😢.

There's not much to this. There's a single API endpoint which will pull the image, get the colours, and respond the sky colour and closest Pantone color info. This endpoint has a cache header for 60 seconds to make subsequent calls in the same minute super fast.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Note that for this specific deployment you'll need to use set the Vercel build command to `npm run vercel-build`.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
