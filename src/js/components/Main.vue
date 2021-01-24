<template>
    <div>
        <h1>Upload file to find faces</h1>
            <file-uploader></file-uploader>
            <div class="image-container">
            <img :src="'data:image/jpeg;base64,' + faces.target" ref='targetImg' @load="onImgLoad"/>
            <template v-if="imgLoaded">  
                <div v-for="bb in faces.allFaces" v-bind:style="bbStyle(bb)" class="bounding-box"></div>
            </template> 
            </div> 
            <!-- <div v-for="face in faces.faces">
            <img :src="'data:image/jpeg;base64,' + face"/>
            </div> -->
    </div>
</template>
<script>
import FileUploader from './FileUploader'
export default {
    name:'Main',
    components:{FileUploader},
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
}
</script>