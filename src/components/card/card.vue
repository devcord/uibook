<template lang="pug">
    .bg-white.shadow-md.rounded-lg.p-4
        p {{ text }}
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