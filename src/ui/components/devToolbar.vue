<template>
    <div class="toolbar">
        <div class="button" v-on:click="fillRes">Fill Resources</div>
    </div>
</template>

<script>
import $ from 'jquery';
import {ResourceType, ParseResources} from '../../data/resources.js';

export default {
    methods: {
        fillRes: function() {
            const restrictedTyped = [ResourceType.Storage, ResourceType.Prestigue];

            ParseResources().forEach((res) => {
                if (!restrictedTyped.includes(res.type) && res.max != -1) {
                    res._amount = res.max;
                }

                console.log(`${ResourceType.properties[res.type].name} - ${res.name} - ${res.amount}/${res.max}`);
            });
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