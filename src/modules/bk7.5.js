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
    static likesEndPoint =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/likes";
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
      const action = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
  
      try {
        const response = await fetch(this.likesEndPoint, action);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Parse the response body as JSON
        console.log("the getted likes are: ", data); // Log the parsed JSON data to the console
        return data; // Return the parsed JSON data
      } catch (error) {
        console.error("Error:", error);
      }
    };
    static setLikes = async (id) => {
      const action = {
        method: "POST",
        body: JSON.stringify({
          item_id: id,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      try {
        const response = await fetch(this.likesEndPoint, action);
        if (response.ok) {
          const responseData = await response.text(); // Parse response as plain text
          console.log("the setted likes are: ", responseData);
          await Shows.updateUI();
          return responseData;
        } else {
          // Handle non-2xx response status codes
          console.error("Error: ", response.status);
          return null; // or throw an error or return an appropriate value
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error: ", error);
        return null; // or throw an error or return an appropriate value
      }
    };
  
    static getLikesById = async (itemId) => {
      const url = `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/likes`;
      try {
        const response = await fetch(url);
        if (response.ok) {
          const responseData = await response.json(); // Parse response as JSON
          const likesData = responseData.filter(
            (item) => item.item_id === itemId
          ); // Filter likes data by item_id
          if (likesData.length > 0) {
            const likesCount = likesData[0].likes; // Extract likes count from filtered data
            console.log(`The likes count for item ${itemId} is: ${likesCount}`);
            return likesCount;
          } else {
            return 0;
          }
        } else {
          // Handle non-2xx response status codes
          console.error("Error: ", response.status);
          return null; // or throw an error or return an appropriate value
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error("Error: ", error);
        return null; // or throw an error or return an appropriate value
      }
    };
  
    static updateUI = async () => {
      const shows = await Shows.getShows();
      const likes = await Shows.getLikes();
      const card = document.getElementById("card");
      const commentBody = document.getElementById("comment-section");
      const tvShows = document.querySelector("#tv-shows p");
      // console.log("eys")
      // console.log("comments: ", comments)
      tvShows.innerHTML = "TV Shows " + "(" + shows.length + ")";
  
      card.innerHTML = "";
      shows.forEach(async (show, index) => {
        card.innerHTML += `
              <div class="container flex-column">
                  <div class="card-image"><img src="${show.image.medium}"></div>
                  <div class="title-like">
                      <div class="show-title"><p>${show.name} ${show.id}</p></div>
                      <div class="likes">
                          <div id='heart${show.id}' class="icon ptr"></div>
                          <div class="likes-count"><p>${
                            likes.filter((like) => like.item_id - 1 === index)[0]
                              .likes
                          } likes</p></div>
                      </div>
                  </div>
                  <div class="card-comments">
                      <button type="button" class="ptr" id="comment-${index}">Comments</button>
                  </div>
              </div>
          `;
      });
  
      shows.forEach((show, index) => {
        const likeHeart = document.getElementById("heart" + show.id);
        likeHeart.addEventListener("click", (e) => {
          Shows.setLikes(show.id);
        });
  
        document
          .getElementById("comment-" + index)
          .addEventListener("click", () => {
            commentBody.innerHTML = "";
            commentBody.innerHTML = `
                    <div class="comments visible" id="comments">
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
                                    <div><textarea rows="8" cols="28"/></textarea></div>
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
      console.log("shows: ", shows);
    };
  }
  
  module.exports = Shows;
  