<template lang="pug">
    h1 {{ text }}
</template>

<script>
export default {
    name: 'DcCard',
    props: {
        text: {
            type: String,
        }
    }
}
</script>