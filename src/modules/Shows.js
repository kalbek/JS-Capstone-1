class Shows {
  //   static apiEndPoint = "https://api.tvmaze.com/shows/4/seasons";
  static apiEndPoint = "https://api.tvmaze.com/shows/1/episodes";
  // static apiEndPoint = "https://api.tvmaze.com/shows/7/seasons";
  //   static apiEndPoint = "https://api.tvmaze.com/schedule/full?page=1";
  //   static apiEndPoint = "https://api.tvmaze.com/schedule/full";
  //   static apiEndPoint =
  //     "https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/5KvA5Psull4GbZZmbL4r/scores/";

  static involvmentAPI =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/";
  static appEndPoint =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/eYZKa59I1mdJ4lf0NxzO/";
  static likesEndPoint =
    "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1ROqsGcxrkx9Q1QtjMZk/likes/";
  static getShows = async () => {
    // document.body.style.overflow = "visible";
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
    const commentBody = document.getElementById("comment-section");

    card.classList.add("wrap", "flex");
    const tvShows = document.querySelector("#tv-shows p");
    tvShows.innerHTML = "TV Shows " + "(" + shows.length + ")";
    shows.forEach((show, index) => {
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
                    <button type="button" class="ptr" id="comment-${index}">Comments</button>
                </div>
            </div>
        `;
      // create click event for likes
      //   add event listener for each comment buttons
    });

    shows.forEach((show, index) => {
      const likeHeart = document.getElementById("heart" + show.id);
      likeHeart.addEventListener("click", (e) => {
        console.log("like-heart: ", show.id);
        Shows.setLikes(show.id);
      });
      //   console.log("lh", likeHeart);

      document
        .getElementById("comment-" + index)
        .addEventListener("click", () => {
          commentBody.innerHTML = "";
          commentBody.innerHTML = `
                  <div class="comments visible popup" id="comments">
                      <div class="container">
                          <div class="image-close flex">
                              <img src="${show.image.original}" alt="" />
                              <div class="close ptr" id='close'></div>
                          </div>
                          <div class='show-details'>
                            <div class="show-name"><p>${show.name}</p></div>
                            <div class="descriptions flex-spaced">
                             <div class="season-rating flex-column">
                                <div>Season: ${show.season}</div>
                                <div>Rating: ${show.rating.average}</div>
                                </div>
                             <div class="season-rating flex-column">
                                <div>Air Date: ${show.airdate}</div>
                                <div>Airtime: ${show.airtime}</div>
                             </div>
                            </div>
                            <div class="comment-header flex-centered ">
                              Comments
                            </div>
                            <div class="add-comment flex-column-centered">
                                <div class=" comment-lists flex-column" id="comment-lists">
                                   <!-- comments goes here ... -->
                                </div>
                                <div class="commnet-controls">
                                  <div class="comment-header add-comment flex-centered ">Add a comment </div>
                                  <button type="button" id="submit-comment" class="ptr">Comment</button>
                                  <div class="name-input"><input type="text"/></div>
                                  <div><textarea rows="8" cols="28"/></div>
                                </div>
                            </div>
                          </div>
                  </div>
              </div>
          `;
          document.body.style.overflow = "hidden";
          const close = document.getElementById("close");
          close.addEventListener("click", () => {
            commentBody.innerHTML = "";
            document.body.style.overflow = "visible";
          });
        });
    });

    const like = await Shows.getLikes();
    console.log("like: ", like);
    // console.log(shows);
  };
}

module.exports = Shows;
