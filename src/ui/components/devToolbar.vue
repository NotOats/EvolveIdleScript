<template>
    <div class="toolbar">
        <div class="button">Hello {{ world }}</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            world: 'World!'
        }
    }
}
</script>

<style scoped>
div.toolbar {
    position: relative;
    margin: 1.75rem 1rem 0rem 1rem;
    border-color:red;
}
div.toolbar .button {
    border-color: purple;
}
</style>