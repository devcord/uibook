import { withKnobs, text } from '@storybook/addon-knobs'
import centered from '@storybook/addon-centered/vue'

import DcCard from './card'
import DcCardLabel from './../card-label/card-label'

export default {
    title: 'Card / Card',
    components: DcCard,
    decorators: [withKnobs, centered]
}

export const Default = () => ({
    components: { DcCard },
    template: `
    <DcCard/>
    `
})

export const WithCardLabel = () => ({
    components: { DcCard, DcCardLabel },
    props: {
        text: {
            default: text('Card Text', 'hello devcord')
        }
    },
    template: `
    <DcCard>
        <DcCardLabel :text="text"/>
    </DcCard>
    `
})