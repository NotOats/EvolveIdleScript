<template>
    <div class="toolbar">
        <div class="button" v-on:click="fillRes">Fill Resources</div>
    </div>
</template>

<script>
import $ from 'jquery';

export default {
    methods: {
        fillRes: function() {
            // Pull resources list
            $('div.resources > div[id*="res"]')
                // Filter out special resources, Plasmid/Phage/etc name
                .filter("div:not(:has(span.has-text-special))")
                // Max each resource
                .each((index, element) => {
                    const data = element.__vue__._data;
                    
                    const restricted = ['Crate', 'Container'];

                    // Crafting max = -1, Gene max = -2
                    // Ignore restricted resources
                    if(data.max > 0 && !restricted.includes(data.name)) {
                        data.amount = data.max;
                    }
                })
        }
    }
}
</script>

<style scoped>
div.toolbar {
    position: relative;
    margin: 1.75rem 1rem 0rem 1rem;
}
div.toolbar .button {
    border-color: purple;
}
</style>