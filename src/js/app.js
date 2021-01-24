import FileUploader from './components/FileUploader.vue'
import '../css/app.css'
import Vue from 'vue'

Vue.component('file-uploader', FileUploader);

new Vue({
  el: '#app',
  components : {FileUploader},
  data () {
    return {
      faces: {},
      file:'',
      imgLoaded:false
    }
  },
  mounted () {
    this.mounted=true;
    
  },
  methods:{
    onImgLoad(){
      this.imgLoaded=true;
    },
    bbStyle: function (bb) {
      if(!bb|| !this.mounted || !this.imgLoaded)
        return {}
        
      let image=this.$refs.targetImg;
      if(!image)
        return {}
      return {
        top:bb.top * image.height +'px',
        left:bb.left * image.width +'px', 
        height:bb.height * image.height +'px',
        width:bb.width * image.width +'px',
      }
  
    },
    
  }

})