class Shows {
  static apiEndPoint = "https://api.tvmaze.com/shows/1/episodes";
  //   static apiEndPoint =
  //     "https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/5KvA5Psull4GbZZmbL4r/scores/";
  static involvmentAPI =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/";
  static appEndPoint =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/eYZKa59I1mdJ4lf0NxzO/";
  static likesEndPoint =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1ROqsGcxrkx9Q1QtjMZk/likes/";
  static getShows = async () => {
    const response = await fetch(this.apiEndPoint).then((response) =>
      response.json()
    );
    return response;
  };
  static appId = "eYZKa59I1mdJ4lf0NxzO";
  static addScore = async () => {
    // grab the name and score from input
    const name = document.getElementById("name");
    const score = document.getElementById("score");

    const action = {
      method: "POST",
      body: JSON.stringify({
        user: name.value,
        score: score.value,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    // post a user and score on api
    if (name.value !== null && score.value !== null) {
      await fetch(Shows.involvmentAPI + "apps/", action).then((response) =>
        response.json()
      );
    }
  };

  static getLikes = async () => {
    const response = await fetch(Shows.likesEndPoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => response);
    return response;
  };
  static setLikes = async (id) => {
    console.log("yey: ", id);
    const response = await fetch(Shows.likesEndPoint)
      .then((response) => response)
      .then((res) => console.log("res: ", res));
    return response;
  };

  static updateUI = async () => {
    const shows = await Shows.getShows();
    const card = document.getElementById("card");
    card.classList.add("wrap", "flex");
    const tvShows = document.querySelector("#tv-shows p");
    tvShows.innerHTML = "TV Shows " + "(" + shows.length + ")";
    shows.forEach((show) => {
      card.innerHTML += `
            <div class="container flex-column">
                <div class="card-image"><img src="${show.image.medium}"></div>
                <div class="title-like">
                    <div class="show-title"><p>${show.name}</p></div>
                    <div class="likes">
                        <div id='heart${show.id}' class="icon ptr"></div>
                        <div class="likes-count"><p>5 likes</p></div>
                    </div>
                </div>
                <div class="card-comments">
                    <button class="ptr" id="comment">Comments</button>
                </div>
            </div>
        `;
      // create click event for likes
    });

    shows.forEach((show) => {
      const likeHeart = document.getElementById("heart" + show.id);
      likeHeart.addEventListener("click", (e) => {
        console.log("like-heart: ", show.id);
        Shows.setLikes(show.id);
      });
      console.log("lh", likeHeart);
    });
    const like = await Shows.getLikes();
    console.log("like: ", like);
    // console.log(shows);
  };
}

module.exports = Shows;
