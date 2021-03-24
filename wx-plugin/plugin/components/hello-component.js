// plugin/components/hello-component.js
import uma from '../umawrap';
Component({
  properties: {
    items: {
      type: Array,
      value: [],
      observer(newVal, oldVal, changedPath) {
        this.setData({items: newVal})
      }
    }
  },

  data: {
    items: []
  },

  methods: {

  }
})
