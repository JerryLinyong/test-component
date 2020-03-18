<!-- 
     组织选择器
 -->
 <template>
  <div class="selectorg-widget">
    <OrgSelector ref="selectorgTree" @currentCheckedNodes="onCurrentCheckedNodes" />
  </div>
</template>

<script>
import OrgSelector from "@/common/OrganizeManage/OrgSelector/dropdown";
import { forEachTree } from "@/utils/tree";

import mixin from "./base.mixin";

export default {
  name: "SelectOrg",
  mixins: [mixin],
  components: {
    OrgSelector
  },
  data() {
    return {};
  },
  watch: {
    value(value) {
      let treeData = this.$refs.selectorgTree.$refs.orgDropdownSelect.$refs
        .orgTree.$refs.tree.data;
      let newCurrentCheckedNodes = [];
      forEachTree(
        {
          children: treeData
        },
        function(node, level, parent) {
          if (Array.isArray(value)) {
            if (value.includes(node.id)) {
              newCurrentCheckedNodes.push(node);
            }
          }
        },
        { idName: "id", allowAbort: true }
      );
      this.$refs.selectorgTree.nodeArr = newCurrentCheckedNodes;
      this.$refs.selectorgTree.$refs.orgDropdownSelect.$refs.orgTree.$refs.tree.setCheckedKeys(
        value
      );
    }
  },
  computed: {},
  methods: {
    toFieldValue(value) {
      return value;
    },

    onCurrentCheckedNodes(nodes) {
      let idArr = [];
      if (nodes.length > 0) {
        nodes.forEach(node => {
          idArr.push(node.id);
        });
      }
      this.value = idArr;
    }
  }
};
</script>


<style lang="scss">
</style>
