import { NextApiRequest, NextApiResponse } from 'next'
import FastAverageColor from 'fast-average-color'
import { createCanvas, loadImage } from 'canvas'
import Color from 'color'
import namer from 'color-namer'
import { utcToZonedTime } from 'date-fns-tz'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=60')
  try {
    const fac = new FastAverageColor()
    const zonedDate = utcToZonedTime(new Date(), 'Australia/Melbourne')
    let camURL: string
    if (zonedDate.getHours() < 16) {
      camURL = 'https://www.somersyc.com.au/webcams/webcam2.jpg'
    } else {
      camURL = 'https://www.somersyc.com.au/webcams/webcam1.jpg'
    }
    const img = await loadImage(camURL)
    const { width, height } = img
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, width, height / 4)

    // get colour
    const colourData = await fac.getColorFromArray4((imageData.data as unknown) as Uint8Array, {
      algorithm: 'sqrt',
    })
    const c = new Color(colourData)
    res.json({ color: c.hex(), name: namer(c.hex()).pantone[0], isDark: c.isDark() })
  } catch (e) {
    res.statusCode = 500
    res.json({ error: JSON.stringify(e) })
  }
}
