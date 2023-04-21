class Shows {
    static appId = "tV364kOhzeIf5RoUn6sV";
    static baseApi = "https://api.tvmaze.com/shows/1/episodes";
    static involvmentAPI =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/";
    static likesURL = `${this.involvmentAPI}apps/${this.appId}/likes`;
    static commentsURL = `${this.involvmentAPI}apps/${this.appId}/comments`;
  
    static getShows = async () => {
      // document.body.style.overflow = "visible";
      const response = await fetch(this.baseApi).then((response) =>
        response.json()
      );
      return response;
    };
  
    static getLikesOrComments = async (url) => {
      const action = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
  
      try {
        const response = await fetch(url, action);
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
  
    static setLikesOrComments = async (body, url) => {
      const action = {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
      try {
        const response = await fetch(url, action);
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
  
    static updateUI = async () => {
      const shows = await Shows.getShows();
      const likes = await Shows.getLikesOrComments(this.likesURL);
      const card = document.getElementById("card");
      const comments = await Shows.getLikesOrComments(
        this.commentsURL + "?item_id=15"
      );
      console.log("comments: ", comments);
      // put all comments in an array
      let commentArray = [];
      // for (let i = 1; i <= shows.length; i++){
      //   commentArray.push(await Shows.getLikesOrComments(`${this.commentsURL}?item_id=${i}`))
      // }
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
          Shows.setLikesOrComments(
            {
              item_id: show.id,
            },
            this.likesURL
          );
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
                                    <div class="comment-header add-comment flex-centered " id='add-comment${index}'>Add a comment </div>
                                    <button type="button" id="${index}"  class="ptr add-comment-button">Comment</button>
                                    <div class="name-input"><input  id="input${index}" type="text"/></div>
                                    <div><textarea rows="8" cols="28" id="textarea${index}" /></textarea></div>
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
            const addCommentButtons = document.querySelectorAll(
              ".add-comment-button"
            );
            console.log("ewerwe", addCommentButtons);
            // Loop through the buttons and add a click event listener to each one
            let name = document.getElementById("input" + index);
            let namee = document.getElementById("input" + 2);
            console.log("name", name)
            console.log("name2", commentBody)
            let comment = document.getElementById("textarea" + index);
            addCommentButtons.forEach((button) => {
              button.addEventListener("click", () => {
                // Your code to handle the click event goes here...
                Shows.setLikesOrComments(
                  {
                    item_id: index + 1,
                    username: name.value,
                    comment: comment.value,
                  },
                  `${this.commentsURL}?item_id=${index + 1}`
                  );
                  console.log("wooooooooooooooo");
                  console.log("naaaaaaaaaaaaame", name.value);
                });
            });
          });
      });
  
      // Get all "Add a comment" buttons
  
      // console.log("dfsdfad: ", document.getElementById("add-comment1"));
      // async function handleComments() {
      //   for (const show of shows) {
      //     document
      //       .getElementById("add-comment1")
      //       .addEventListener("click", async () => {
      //         // Use async function with await
      //         await setLikesOrComments(
      //           {
      //             item_id: index + 1,
      //             username: document.getElementById("input" + index + 1),
      //             comment: document.getElementById("textarea" + index + 1),
      //           },
      //           `${this.commentsURL}?item_id=${index + 1}`
      //         );
      //       });
      //   }
      // }
      // await handleComments();
    };
  }
  
  module.exports = Shows;
  