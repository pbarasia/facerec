<template>
    <input type="file" name="myFile" ref="file" v-on:change="handleFileUpload()"/>
</template>

<script>
export default {
    name:"FileUploader",
    data(){
        return {}
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

}
</script>

