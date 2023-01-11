const { createApp } = Vue

  createApp({
    data() {
      return {
        busqueda: '',
        tracks: undefined,
        client_id: "3a05bf07db6844a5a7e244e5cd6ca6a0",
        client_secret: "34eee371f8f74fc3ae4dfb6c34787e21",
        access_token: "BQDzoqCqBL2K9PD5eBMn9Obw22kMB6u1StsSGQeMX1KbREnL0oU1ShD1iiRQmOr1Q79GCGmhUj79vtMaBj0-KiQC0DrXYc5pqjID84y8o17kB1kj2cA",
        authParameters: {
            method:"POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "grant_type=client_credentials&client_id=" + this.client_id + "&client_secret=" + this.client_secret
        },
        offset: 0,
        request: undefined,
        configs:{
            Accept:"application/json",
           "Content-Type":"application/json",
           Authorization:"Bearer " + this.access_token
        }
      }
    },
    methods: {
        throwPetition(firstTime){
            var throwed = false;
            if(firstTime && !throwed){
                throwed = true;

                axios.get('https://api.spotify.com/v1/search?q=' + this.busqueda + '&type=track&offset=' + this.offset, this.configs)
                    .then((data) => {
                        this.tracks = data.data.tracks.items;
                    })
                    .catch(error => console.log(error));
                throwed = false;
                this.offset += 20;
            } else {
                throwed = true;
                if (this.busqueda != ""){
                    axios.get('https://api.spotify.com/v1/search?q=' + this.busqueda + '&type=track&offset=' + this.offset, this.configs)
                        .then((data) => {
                            this.tracks = data.data.tracks.items;
                        })
                        .catch(error => console.log(error));
                }

                throwed = false;
                this.offset += 20;
            }
        },

        clearResults(){
            document.getElementById("results").innerHTML = "";
            this.busqueda = "";
        }
    },
    mounted(){
        window.addEventListener('scroll',()=>{
            if(window.scrollY + window.innerHeight >= 
            document.documentElement.scrollHeight){
                this.throwPetition(false);
            }
        })
    },
  }).mount('#app')