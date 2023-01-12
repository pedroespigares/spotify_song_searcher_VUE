const { createApp } = Vue



  createApp({
    data() {
      return {
        busqueda: '',
        tracks: undefined,
        client_id: "3a05bf07db6844a5a7e244e5cd6ca6a0",
        client_secret: "34eee371f8f74fc3ae4dfb6c34787e21",
        access_token: "",
        offset: 0,

    // Configuración para las peticiones a la API de Spotify
        headers:{
            Accept:"application/json",
           "Content-Type":"application/json",
           Authorization:"Bearer " + this.access_token
        },
      }
    },
    methods: {
        throwPetition(scroll = false){
            var throwed = false;
            if(!throwed){
                this.offset = 0;
                throwed = true;

                axios({
                    method: 'get',
                    url: 'https://api.spotify.com/v1/search?q=' + this.busqueda + '&type=track&offset=' + this.offset,
                    headers: this.headers
                }).then((data) => {
                    this.tracks = data.data.tracks.items;
                })
                .catch(error => console.log(error));
                
                throwed = false;
                this.offset += 20;
            }

            if(scroll){
                axios({
                    method: 'get',
                    url: 'https://api.spotify.com/v1/search?q=' + this.busqueda + '&type=track&offset=' + this.offset,
                    headers: this.headers
                }).then((data) => {
                    this.tracks = this.tracks.concat(data.data.tracks.items);
                })
                .catch(error => console.log(error));

                this.offset += 20;
            }
        },

        clearResults(){
            this.offset = 0;
            this.tracks = undefined;
            this.busqueda = "";
        },

        audioHandler(e){
            var audio = e.target.parentElement.parentElement.getElementsByTagName("audio")[0];
            if(e.target.classList.contains("fa-play")){
                audio.volume = 0.2;
                audio.play();

                e.target.classList.remove("fa-play");
                e.target.classList.add("fa-pause");

                if(audio.ended){
                    e.target.classList.remove("fa-play");
                    e.target.classList.add("fa-pause");
                }
            } else if (e.target.classList.contains("fa-pause")){
                audio.pause();
                
                e.target.classList.remove("fa-pause");
                e.target.classList.add("fa-play");
            }
        }
    },
    mounted(){
        axios({

            // Esta sintaxis es para la peticion POST del access_token de la API
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: "grant_type=client_credentials",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            auth: {
                username: this.client_id,
                password: this.client_secret
            }
            }).then((data) => {
                this.access_token = data.data.access_token;
                this.headers.Authorization = "Bearer " + this.access_token;
            })

        window.addEventListener('scroll',()=>{
            if(window.scrollY + window.innerHeight >= 
            document.documentElement.scrollHeight){
                this.throwPetition(true);
            }
        })
    },
  }).mount('#app')