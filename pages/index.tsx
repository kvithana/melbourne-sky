import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'

function fetcher<T>() {
  return (url: string) => fetch(url).then((r) => r.json() as Promise<T>)
}

interface APIData {
  name: { name: string; hex: string; distance: number }
  color: string
}

export default function Home() {
  const { data } = useSWR('/api/color', fetcher<APIData>(), { refreshInterval: 30e3 })

  return (
    <div className={styles.container} style={{ backgroundColor: data ? data.color : 'white' }}>
      <Head>
        <title>The Melbourne Sky</title>
        <meta name="description" content="Ever just wonder what colour the sky in Melbourne is?" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>The Melbourne sky is {data ? data.name.name : 'White'}.</h1>

        {/* <p className={styles.description}>
          Get started by editing <code className={styles.code}>pages/index.js</code>
        </p> */}
      </main>

      <footer className={styles.footer}>
        <a href="https://twitter.com/_kalpal" target="_blank" rel="noopener noreferrer">
          <span>
            Built by <strong>@_kalpal</strong>🌅
          </span>
        </a>
      </footer>
    </div>
  )
}
