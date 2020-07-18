import { withKnobs, text } from '@storybook/addon-knobs'
import centered from '@storybook/addon-centered/vue'
import DcCardLabel from './card-label'

export default {
    title: 'Card / Label',
    components: DcCardLabel,
    decorators: [withKnobs, centered]
}

export const Default = () => ({
    components: { DcCardLabel },
    props: {
        text: {
            default: text('Card Label', 'hello devcord')
        }
    },
    template: `<DcCardLabel :text="text" />`
})