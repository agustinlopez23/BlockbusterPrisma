const  ejectFetch=async()=>{

    async function fetchMovies() {
        const res = await fetch("https:ghibliapi.herokuapp.com/films");
        const data = await res.json();
        return data;
      }
      
      
      let movies = await fetchMovies()
      return movies
}

module.exports=ejectFetch