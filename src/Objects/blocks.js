import {col, css, row} from "../utils";
class Block{
    constructor(value, settings) {
        this.value = value
        this.settings = settings
    }
    toHTML(){
        throw new Error('Что-то надо реализовать')
    }
}
export class TitleBlock extends Block {
    constructor(value, settings) {
        super(value, settings)
    }
    toHTML() {
        const {tag = 'h1', styles} = this.settings
        return [row(col(`<${tag}>${this.value}</${tag}>`), css(styles))]
    }
}

export class ImageBlock extends Block{
    constructor(value, settings) {
        super(value, settings)
    }
    toHTML() {
        const {imageStyles: iS, alt, styles} = this.settings
        return [row(`<img src = "${this.value}" alt="${alt}" style ="${css(iS)}"/>`, css(styles))]
    }
}

export class ColumnsBlock extends Block{
    constructor(value, settings) {
        super(value, settings)
    }
    toHTML() {
        const html = this.value.map(col).join('')
        return [row(html, css(this.settings.styles))]
    }
}

export class TextBlock extends Block{
    constructor(value, settings) {
        super(value, settings);
    }
    toHTML() {
        return [row(col(`<p>${this.value}</p>`), css(this.settings.styles))]
    }
}