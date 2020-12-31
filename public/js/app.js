new Vue({
  el: '#app',
  data () {
    return {
      faces: {},
      message:'test',
      file:''
    }
  },
  computed: {
    // bStyle: function () {
    //   if(!this.faces.boundingBox || !this.mounted)
    //     return {}
        
    //   let image=this.$refs.targetImg;
    //   if(!image)
    //     return {}
    //   let bb=this.faces.boundingBox.SearchedFaceBoundingBox;
    //   return {
    //     top:bb.Top * 1000 +'px',
    //     left:bb.Left * image.width +'px', 
    //     height:bb.Height * 1000 +'px',
    //     width:bb.Width * image.width +'px',

    //   }
  
    // }
  },
  mounted () {
    this.mounted=true;
    
  },
  methods:{
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