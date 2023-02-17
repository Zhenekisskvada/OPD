import image from './images/img.png'
import {TitleBlock, ImageBlock, ColumnsBlock, TextBlock} from './Objects/blocks'


const text =`just some txt idgaf`
export const model = [
    new TitleBlock('Main title', {
        tag: 'h2',
        styles: {
            background: 'linear-gradient(to right, #ff0099, #493240)',
            color: '#fff',
            padding: '2rem',
            'text-align': 'center'
        }
    }),
    new ImageBlock(image, {
        styles: {
            padding: '2rem 0',
            display: 'flex',
            'justify-content': 'center',
        },
        imageStyles: {
            width: '10%',
            height: 'auto'
        },
        alt: 'Some txt'

    }),
    new ColumnsBlock([
        'firstLine',
        'secondLine',
        'thirdLine'
    ], {
        styles: {
            background: 'linear-gradient(to bottom, #8e2de2, #4a00e0)',
            padding: '2rem',
            color: '#fff',
            'font-weight': 'bold'
        }
    }),
    new TextBlock(text, {
        styles: {
            background: 'linear-gradient(to left, #f2994a, #f2c94c)',
            padding: '1.5rem',
            'font-weight': 'bold'
        }
    }),
]