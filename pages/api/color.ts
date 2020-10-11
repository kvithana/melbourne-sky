import { NextApiRequest, NextApiResponse } from 'next'
import FastAverageColor from 'fast-average-color'
import { createCanvas, loadImage } from 'canvas'
import Color from 'color'
import namer from 'color-namer'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  try {
    const fac = new FastAverageColor()
    const img = await loadImage('https://www.somersyc.com.au/webcams/webcam1.jpg')
    const { width, height } = img
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 30, width, height / 2)

    // get colour
    const colourData = await fac.getColorFromArray4((imageData.data as unknown) as Uint8Array, {
      algorithm: 'sqrt',
    })
    const c = new Color(colourData)
    res.json({ color: c.hex(), name: namer(c.hex()).pantone[0] })
  } catch (e) {
    res.statusCode = 500
    res.json({ error: JSON.stringify(e) })
  }
}
