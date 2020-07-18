<template lang="pug">
    p {{ text }}
</template>

<script>
export default {
    name: 'DcCardLabel',
    props: {
        text: {
            type: String,
        }
    }
}
</script>