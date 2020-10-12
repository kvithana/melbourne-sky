import { NextApiRequest, NextApiResponse } from 'next'
import FastAverageColor from 'fast-average-color'
import { createCanvas, ImageData, loadImage } from 'canvas'
import Color from 'color'
import namer from 'color-namer'
import { utcToZonedTime } from 'date-fns-tz'
import SunCalc from 'suncalc'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=60')
  const fac = new FastAverageColor()
  const zonedDate = utcToZonedTime(new Date(), 'Australia/Melbourne')
  let camURL: string
  if (zonedDate.getHours() < 10) {
    camURL = 'https://www.somersyc.com.au/webcams/webcam2.jpg'
  } else {
    camURL = 'https://www.somersyc.com.au/webcams/webcam1.jpg'
  }

  try {
    const img = await loadImage(camURL)
    const { width, height } = img
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    // crop image
    let imageData: ImageData
    if (camURL == 'https://www.somersyc.com.au/webcams/webcam1.jpg') {
      imageData = ctx.getImageData(0, 200, width - 200, 100)
    } else {
      imageData = ctx.getImageData(0, 0, width, 200)
    }

    // get colour
    const colourData = await fac.getColorFromArray4((imageData.data as unknown) as Uint8Array, {
      algorithm: 'simple',
    })

    // saturate
    const c = new Color(colourData).saturate(0.5)

    // suncalc

    const times = SunCalc.getTimes(zonedDate, -37.840935, 144.946457)

    res.json({
      color: c.hex(),
      name: namer(c.hex()).pantone[0],
      isDark: c.isDark(),
      times: {
        isNight: new Date(times.dusk) < zonedDate || new Date(times.dawn) > zonedDate,
        isGoldenHour: new Date(times.goldenHour) < zonedDate && new Date(times.goldenHourEnd) > zonedDate,
        dawn: times.dawn,
        dusk: times.dusk,
        goldenHour: times.goldenHour,
        goldenHourEnd: times.goldenHourEnd,
      },
    })
  } catch (e) {
    res.statusCode = 500
    res.json({ error: JSON.stringify(e) })
  }
}
