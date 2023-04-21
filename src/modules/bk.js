class Shows {
    // static apiEndPoint = "https://api.tvmaze.com/shows/4/seasons";
    static apiEndPoint = "https://api.tvmaze.com/shows/1/episodes";
    // static apiEndPoint = "https://api.tvmaze.com/shows/7/seasons";
    // static apiEndPoint = "https://api.tvmaze.com/schedule/full?page=1";
    // static apiEndPoint = "https://api.tvmaze.com/schedule/full";
    // static apiEndPoint = "https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/5KvA5Psull4GbZZmbL4r/scores/";
  
    static involvmentAPI =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/";
    static appEndPoint =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/eYZKa59I1mdJ4lf0NxzO/";
    static likesEndPoint =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/1ROqsGcxrkx9Q1QtjMZk/likes/";
    static likesEndPoint2 =
      "https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/4ptV0nMfyZo5CoVpkt7A/likes";
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
    // Inside the Shows class
  
    static setLikes = async (id, updateUI) => {
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
          const responseData = await response.text();
          console.log("the liked item is: ", responseData);
  
          // Call the updateUI callback function to update the UI
          if (updateUI && typeof updateUI === "function") {
            updateUI(responseData);
          }
  
          return responseData;
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    static getLikes2 = async () => {
      const action = {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      };
  
      try {
        const response = await fetch(this.likesEndPoint2, action);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("the getted likes are: ", data);
        return data;
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    static setLikes2 = async (id) => {
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
        const response = await fetch(this.likesEndPoint2, action);
        if (response.ok) {
          const responseData = await response.text();
          console.log("the liked item is: ", responseData);
          return responseData;
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    static getShowsBySeason = async (season) => {
      const response = await fetch(`${this.apiEndPoint}/${season}`).then(
        (response) => response.json()
      );
      return response;
    };
  }
  
  // Usage:
  // const shows = await Shows.getShows();
  // console.log(shows);
  
  // const likes = await Shows.getLikes();
  // console.log(likes);
  
  // const likes2 = await Shows.getLikes2();
  // console.log(likes2);
  
  // const showsBySeason = await Shows.getShowsBySeason(1);
  // console.log(showsBySeason);
  