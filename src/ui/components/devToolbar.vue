<template>
    <div class="toolbar">
        <button class="button" @click="fillRes">Fill Resources</button>

        <b-dropdown>
            <button class="button" slot="trigger" @mousemove="loadSaves">
                <span>Load Save</span>
                <b-icon icon="menu-down" type="is-light"></b-icon>
            </button>

            <div v-for="save in saveGames" v-bind:key="save.id" class="save-dropdown">
                <b-dropdown-item v-if="save.data != undefined">
                    <div class="buttons has-addons special">
                        <b-button @click="saveOrLoad(save)" class="start">{{ save.name }}</b-button>
                        <b-button @click="deleteSave(save)" class="end" icon-right="close"></b-button>
                    </div>
                </b-dropdown-item>
                <b-dropdown-item v-else>
                    <b-button @click="saveOrLoad(save)" expanded="true">{{ save.name || 'Empty' }}</b-button>
                </b-dropdown-item>
            </div>
        </b-dropdown>

        <button class="button right danger" @click="hardReset">HARD RESET</button>
    </div>
</template>

<script>
import $ from 'jquery';
import {ResourceType, ParseResources} from '../../data/resources.js';
import {SaveManager} from '../../utils/saveManager.js';

const saveManager = new SaveManager();

export default {
    // Custom initialization function, returns mount id
    initialize() {
        const mountId = 'devToolbarVue';
        
        // Insert toolbar vue
        $('<div></div>')
            .attr('id', mountId)
            .insertAfter('#topBar');

        // Fix .main top margin
        $('.main').css('margin-top', '0.5rem');

        // Setup fillRes hotkey
        console.log('[DevToolbar] Fill resources is now bound to "f".');
        $(document).keypress((e) => {
            // lowercase f
            if (e.charCode == 102) {
                this.methods.fillRes();
            }
        });

        return mountId;
    },
    data() {
        return {
            saveGames: saveManager.saves,
        };
    },
    methods: {
        fillRes: function() {
            const restrictedTyped = [ResourceType.Storage, ResourceType.Prestigue];

            ParseResources().forEach((res) => {
                if (!restrictedTyped.includes(res.type) &&
                        res.max > 0 && res.display) {
                    res._amount = res.max;
                }
            });
        },
        loadSaves: function() {
            this.saves = saveManager.saves;
        },
        saveOrLoad: function(save) {
            // Load
            if (save.data != undefined) {
                window.importGame(save.data);
            } else {
                // Save
                if (saveManager.storeSave(save.id)) {
                    saveManager.save();
                    this.saveGames = saveManager.saves;
                }
            }
        },
        deleteSave: function(save) {
            if (saveManager.removeSave(save.id)) {
                saveManager.save();
            }
        },
        hardReset: function() {
            if (process.env.NODE_ENV != 'development') {
                this.$buefy.dialog.confirm({
                    title: 'Hard Reset',
                    message: '<span style="color: darkred;">You are about to delete your Evolve save game.</span>',
                    confirmText: 'Delete Save',
                    type: 'is-danger',
                    hasIcon: true,
                    onConfirm: () => window.reset()
                });
            } else {
                window.reset();
            }
        }
    }
}
</script>

<style scoped>
div.toolbar {
    position: relative;
    margin: 1.75rem 1rem 0rem 1rem;
}
div.toolbar button.button {
    border-color: purple;
}
div.toolbar button.right {
    float: right;
}

div.toolbar button.danger:hover {
    background-color: red;
}

.has-addons.special {
    display: flex;
}

.has-addons.special > .start {
    flex: 1;
}

.has-addons.special > .end {
    flex: 0;
}

.save-dropdown {
    width: 450px;
}

.save-dropdown > .dropdown-item {
    padding: 0.25rem;
}
</style>