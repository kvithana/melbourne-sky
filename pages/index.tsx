import React, { useState } from 'react'
import Head from 'next/head'
import useSWR from 'swr'

function fetcher<T>() {
  return (url: string) => fetch(url).then((r) => r.json() as Promise<T>)
}

interface APIData {
  name: { name: string; hex: string; distance: number }
  color: string
  isDark: boolean
}

const ColorCard = ({ data }: { data: APIData }) => {
  return (
    <div className="bg-white text-gray-900 rounded-md p-2 flex flex-row items-center cursor-default">
      <div className="w-20 h-20 rounded-md" style={{ backgroundColor: data?.name?.hex || '#ffff' }} />
      <div className="flex flex-col ml-2">
        <p className="tracking-wide text-gray-600 text-xs">CLOSEST PANTONE</p>
        <p className="text-xl">{data?.name?.name}</p>
        <p className="text-gray-600 tracking-wide">{data?.name?.hex}</p>
      </div>
    </div>
  )
}

const AboutModal = ({ visible, toggleVisible }: { visible: boolean; toggleVisible: () => void }) => {
  return (
    <>
      <div
        className="w-screen h-screen bg-black absolute transition-opacity duration-500"
        style={{ opacity: visible ? 0.9 : 0 }}
      />
      <div
        className={`${
          visible ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-500 flex flex-col p-5 rounded-md absolute z-10 w-full text-white`}
        style={{ maxWidth: '600px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <h1 className="font-bold text-2xl mb-5">The Melbourne Sky</h1>

        <p>
          A little website that tells you the colour of the Melbourne sky by analysing the colours in an image from{' '}
          <a
            href="https://www.somersyc.com.au/webcams/webcam1.html"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b"
          >
            this
          </a>{' '}
          webcam. The page will update once a minute automatically.
        </p>
        <p className="text-gray-400 mt-5">
          An experiment 🧪 by{' '}
          <a className="border-b" href="https://twitter.com/_kalpal" target="_blank" rel="noopener noreferrer">
            Kalana Vithana
          </a>
          . View the source on{' '}
          <a
            className="border-b"
            href="https://github.com/kvithana/melbourne-sky"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          .
        </p>
        <div className="flex justify-end w-full mt-5">
          <button onClick={toggleVisible} className="text-gray-600 px-1 border-b tracking-wide border-gray-600">
            Close
          </button>
        </div>
      </div>
    </>
  )
}

export default function Home() {
  const { data } = useSWR('/api/color', fetcher<APIData>(), { refreshInterval: 30e3 })
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <div className="w-screen h-screen" style={{ backgroundColor: data ? data.color : 'white' }}>
      <div
        className="flex flex-col w-full h-full justify-center items-center"
        style={{ backgroundColor: data ? data.color : 'white' }}
      >
        <Head>
          <title>The Melbourne Sky</title>
          <meta
            name="description"
            content=" A little website that tells you the colour of the Melbourne sky as a hex colour."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={` ${data?.isDark ? 'text-purple-100' : 'text-blue-900'} `}>
          <h1 className="text-2xl text-center">
            The Melbourne sky is{' '}
            <a
              href={`https://www.color-hex.com/color/${data?.color.replace('#', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={'border-b cursor-pointer' + ` ${data?.isDark ? 'border-purple-100' : 'border-blue-900'}`}
            >
              {data?.color || 'a color'}
            </a>
            .
          </h1>
          <div className="h-4" />
          {data ? <ColorCard data={data} /> : null}
        </main>

        {modalVisible ? (
          <AboutModal visible={modalVisible} toggleVisible={() => setModalVisible(!modalVisible)} />
        ) : null}

        <footer
          className={
            'flex fixed bottom-0 w-screen justify-end p-2' + ` ${data?.isDark ? 'text-purple-100' : 'text-blue-900'} `
          }
        >
          <div className="flex">
            <button
              onClick={() => setModalVisible(true)}
              className={'border-b' + ` ${data?.isDark ? 'border-purple-100' : 'border-blue-900'} `}
            >
              About
            </button>
            <span className="px-2">•</span>
            <a href="https://twitter.com/_kalpal" target="_blank" rel="noopener noreferrer">
              <span>🔨 by @_kalpal</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
