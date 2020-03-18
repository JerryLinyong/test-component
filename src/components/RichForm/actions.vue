
<template>
	<div class="actions">
		<template v-for="(action,index) of leftActions">
            <el-button 
                :key="index"
                :type="action.type"
                v-if="action.visible!=false"
                :size="action.size || form.size"
                @click="onActionClick(action,$event)"
                :native-type="getButtonType(action)"
            >               
                <i :class="action.icon" v-if="action.icon"></i> {{action.title}}
            </el-button>
		</template>
        <div class="right">
            <template v-for="(action,index) of rightActions">
                <el-button
                    :key="index"
                    :type="action.type"
                    :size="action.size || form.size"
                    v-if="action.visible!=false"
                    @click="onActionClick(action,$event)"
                    :native-type="getButtonType(action)"
                >               
                    <i :class="action.icon" v-if="action.icon"></i> {{action.title}}
                </el-button>                
            </template>
        </div>
	</div>
</template>

<script>
import eventbus from "./eventbus" 

export default {
    name: "RichFormActions",
	props: {
        actions: Array,
        form:Object
	},
	data() { 
        return {}
	},
	computed: {
        leftActions:function(){
            return this.actions.filter((action)=>action.right!=true)
        },
        rightActions:function(){
            return this.actions.filter((action)=>action.right==true)
        }
	},
	methods: {
        getButtonType(action){
            return action.submit ? 'submit' : ( action.reset ? 'reset' : 'button' )
        },
        onActionClick(action,event){
            eventbus.$emit(`${this.form.id}:action`,action)
            event.stopPropagation()
        }
	}
}
</script>

<style lang="scss" scoped>
</style>
