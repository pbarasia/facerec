new Vue({
  el: '#app',
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
    handleFileUpload(){
      let self=this
     this.file = this.$refs.file.files[0];
     let formData = new FormData();
     formData.append('myFile', this.file);
     axios.post( '/uploadfile',
      formData,
      {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function(data){
      console.log('SUCCESS!!');
      axios
      .get('/showFaces?targetImage='+data.data.filename)
      .then(function(response){
        self.faces = response.data
      })
    })
    .catch(function(){
      console.log('FAILURE!!');
    });
    }
  }

})