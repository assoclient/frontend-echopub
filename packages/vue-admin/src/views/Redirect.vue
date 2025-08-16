<template>
  <div class="privacy-policy">
    <!-- Navigation -->
    <i>Redirection en cours</i>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { redirectService } from '../services/api';

export default {
  name: 'Redirect',
  mounted() {
    console.log('Redirect component mounted', this.$route);
    
    const param1 = this.$route.params.param1; // "gnrlFyD"
    const param2 = this.$route.params.param2; // "68971b4b64e5b4912970aa18"
    console.log(`Param1: ${param1}, Param2: ${param2}`);
    
    this.updateClick(param1, param2);
  },
  methods:{
    async updateClick(shortLink, userId) {
        const response = await redirectService.updateClicks(shortLink, userId);
        if (response.redirectUrl) {
          const redirectUrl = response.redirectUrl;
          window.location.href = redirectUrl;
        } else {    
          console.error('Error updating clicks:', response);
          // Optionally, handle the error (e.g., show a message to the user)
        }
    }  
      
    
  }
}
</script>

<style scoped>


</style>
