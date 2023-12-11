import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const API_URL="https://researchpaperquery.azurewebsites.net/";

createApp({
  data() {
    return {
      currNamespace:'',
      namess:[]
    }
  },
  methods:{
    async GetCurrentNamespace(){
        try{
            axios.get(API_URL+'users/getcurrentnamespace')
            .then(response => {
                this.currNamespace = response.data.namespace;
            })

        } catch(error){
            console.log(error);
        }
    },
    async GetNamespaces(){
        try{
            axios.get(API_URL+'users/getnamespaces')
            .then(response => {
                this.namespaces = response.data.namespaces;
            })

        } catch(error){
            console.log(error);
        }
    }
    },
    mounted(){
        this.GetCurrentNamespace();
    }
    
  }).mount('#app')