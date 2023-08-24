export default class TreeHelper {
    static getItemByIdInTree = (id, tree) => {
        let res = null
        
        for(let i=0;i<tree.length;i++) {
          let ele = tree[i]
          ele.id===id ? res = ele : ''
          if(res) break;
          if(ele.children.length) {
            res = this.getItemByIdInTree(id,ele.children)
          } 
        }
        return res
      }

      static getItemParentByIdInTree = (id, tree) => {
        let res = null
        
        for(let i=0;i<tree.length;i++) {
          let ele = tree[i]
          ele.id === id ? res = tree : ''
          if(res) break;
          if(ele.children.length) {
            res = this.getItemParentByIdInTree(id,ele.children)
          } 
        }
        return res
      }
}