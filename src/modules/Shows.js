class Shows {
  static appId = 'tV364kOhzeIf5RoUn6sV';

  static baseApi = 'https://api.tvmaze.com/shows/1/episodes';

  static involvmentAPI =
    'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/';

  static likesURL = `${this.involvmentAPI}apps/${this.appId}/likes`;

  static commentsURL = `${this.involvmentAPI}apps/${this.appId}/comments`;

  static globalIndex = 0;

  static getShows = async () => {
    // document.body.style.overflow = "visible";
    const response = await fetch(this.baseApi).then((response) => response.json());
    return response;
  };

  static getLikesOrComments = async (url) => {
    const action = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };

    try {
      const response = await fetch(url, action);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json(); // Parse the response body as JSON
      return data; // Return the parsed JSON data
    } catch (error) {
      return error;
    }
  };

  static getLikesURL() {
    const appId = 'tV364kOhzeIf5RoUn6sV';
    const involvmentAPI = 'https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/';
    return `${involvmentAPI}apps/${appId}/likes`;
  }

  static setLikesOrComments = async (body, url) => {
    const action = {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    };
    try {
      const response = await fetch(url, action);
      if (response.ok) {
        const responseData = await response.text(); // Parse response as plain text
        await Shows.updateUI();
        return responseData;
      }
      // Handle non-2xx response status codes
      return null; // or throw an error or return an appropriate value
    } catch (error) {
      // Handle network errors or other exceptions
      return null; // or throw an error or return an appropriate value
    }
  };

  static updateUI = async () => {
    const shows = await Shows.getShows();
    const likes = await Shows.getLikesOrComments(this.likesURL);
    const card = document.getElementById('card');

    const commentBody = document.getElementById('comment-section');
    const tvShows = document.querySelector('#tv-shows p');
    tvShows.innerHTML = `${'TV Shows ('}${shows.length})`;

    card.innerHTML = '';
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
      const likeHeart = document.getElementById(`heart${show.id}`);
      likeHeart.addEventListener('click', () => {
        Shows.setLikesOrComments(
          {
            item_id: show.id,
          },
          this.likesURL,
        );
      });
      // create comments popup when comment button is clicked
      document
        .getElementById(`comment-${index}`)
        .addEventListener('click', () => {
          Shows.globalIndex = index + 1;
          // display comments on comments section
          async function popuplateComments() {
            const commenting = await Shows.getLikesOrComments(
              `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/comments?item_id=${Shows.globalIndex}`,
            );
            const commentSection = document.getElementById('comment-lists');
            commentSection.innerHTML = '';
            commenting.forEach((comment) => {
              commentSection.innerHTML += `<p>${comment.creation_date} ${comment.username} ${comment.comment}</p>`;
            });
          }
          popuplateComments();
          // create the popup
          commentBody.innerHTML = '';
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
                                  <div class="name-input" ><input id="input${index}" type="text"/></div>
                                  <div><textarea rows="8" cols="28" id="textarea${index}" /></textarea></div>
                                </div>
                            </div>
                          </div>
                  </div>
              </div>
          `;
          // handle close button for comments popup
          document.body.style.overflow = 'hidden';
          const close = document.getElementById('close');
          close.addEventListener('click', () => {
            commentBody.innerHTML = '';
            document.body.style.overflow = 'visible';
          });

          // handle comments updating on api
          const name = document.getElementById(`input${index}`);
          const comment = document.getElementById(`textarea${index}`);

          const addCommentButtons = document.querySelectorAll(
            '.add-comment-button',
          );
          const addButtonArray = [...addCommentButtons];
          async function someFn() {
            await Promise.all(
              addButtonArray.map(async (button) => {
                button.addEventListener('click', async () => {
                  await Shows.setLikesOrComments(
                    {
                      item_id: index + 1,
                      username: name.value,
                      comment: comment.value,
                    },
                    `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/comments?item_id=${index}`,
                  );
                });

                Shows.globalIndex = index + 1;
              }),
            );
          }

          someFn();
        });
    });

    // display comments on comments section
    const commenting = await Shows.getLikesOrComments(
      `https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/tV364kOhzeIf5RoUn6sV/comments?item_id=${Shows.globalIndex}`,
    );
    const commentSection = document.getElementById('comment-lists');
    commentSection.innerHTML = '';
    commenting.forEach((comment) => {
      commentSection.innerHTML += `<p>${comment.creation_date} ${comment.username} ${comment.comment}</p>`;
    });
  };
}

module.exports = Shows;
