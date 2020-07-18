import { withKnobs, text } from '@storybook/addon-knobs'
import centered from '@storybook/addon-centered/vue'
import DcCard from './card'

export default {
    title: 'Card',
    components: DcCard,
    decorators: [withKnobs, centered]
}

export const Default = () => ({
    components: { DcCard },
    props: {
        text: {
            default: text('Card Text', 'hello devcord')
        }
    },
    template: `<DcCard :text="text" />`
})