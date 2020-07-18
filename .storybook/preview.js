import Vue from 'vue'
import uibook from './../src/framework'

Vue.use(uibook)

import { addParameters } from '@storybook/vue'

addParameters({
    backgrounds: {
        default: 'Gray',
        values: [
            { name: 'Transparent', value: 'transparent' },
            { name: 'Gray', value: '#eeeeee' },
            { name: 'Black', value: '#000000' }
        ],
      },
});
