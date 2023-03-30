import { tweetsData } from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.dataset.delete) {
    handleDeleteTweet(e.target.dataset.delete);
  } else if (e.target.id === "send-tweet") {
    handleSendBtnClick(e.target.dataset.send);
    console.log(e);
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isLiked) {
    targetTweetObj.likes--;
  } else {
    targetTweetObj.likes++;
  }
  targetTweetObj.isLiked = !targetTweetObj.isLiked;
  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (targetTweetObj.isRetweeted) {
    targetTweetObj.retweets--;
  } else {
    targetTweetObj.retweets++;
  }
  targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted;
  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value !== "") {
    tweetsData.unshift({
      handle: `@johnnydev`,
      profilePic: `images/yay.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    render();
    tweetInput.value = "";
  }
}

function handleSendBtnClick(sendId) {
  const replyInput = document.getElementById("reply-input");
  const targetSendReplyObj = tweetsData.filter(function (reply) {
    return reply.uuid === sendId;
  })[0];

  let indexOfObject = tweetsData.indexOf(targetSendReplyObj);

  console.log(targetSendReplyObj);
  console.log(replyInput.value);

  if (replyInput.value !== "") {
    tweetsData[indexOfObject].replies.unshift({
      handle: `@johnnydev`,
      profilePic: `images/yay.png`,
      tweetText: replyInput.value,
    });
    render();
    replyInput.value = "";
  }
}

function handleDeleteTweet(deleteTweetId) {
  console.log(deleteTweetId);
  const targetTweetObj = tweetsData.filter(function (tweet) {
    return tweet.uuid === deleteTweetId;
  })[0];
  let indexOfObject = tweetsData.indexOf(targetTweetObj);
  tweetsData.splice(indexOfObject, 1);

  render();
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    let retweetIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }

    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";
    let newReply = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        newReply = `
        <div class="reply-container">
          <textarea placeholder="reply" id="reply-input"></textarea>
          <button id="send-tweet" "class="send-tweet" data-send="${tweet.uuid}">tweet</button>
        </div>
      `;
        repliesHtml += `
        <div class="tweet-reply">
              <div class="tweet-inner">
                <img src="${reply.profilePic}" class="profile-pic">
                  <div>
                      <p class="handle">${reply.handle}</p>
                      <p class="tweet-text">${reply.tweetText}</p>
                  </div>
              </div>
          </div>`;
      });
    }

    if (tweet.replies.length === 0) {
      newReply = `
        <div class="reply-container">
          <textarea placeholder="reply" id="reply-input"></textarea>
          <button id="send-tweet" "class="send-tweet" data-send="${tweet.uuid}">tweet</button>
        </div>
      `;
    }

    feedHtml += `
    <div class="tweet">
        <div class="tweet-inner">
            <img src="${tweet.profilePic}" class="profile-pic">
            <div class="tweet-container">
              <p class="handle">${tweet.handle}</p>
              <button class="delete" data-delete="${tweet.uuid}">X</button>
              <p class="tweet-text">${tweet.tweetText}</p>
              <div class="tweet-details">
                  <span class="tweet-detail">
                  <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                      ${tweet.replies.length}
                  </span>
                  <span class="tweet-detail">
                  <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                      ${tweet.likes}
                  </span>
                  <span class="tweet-detail">
                  <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                      ${tweet.retweets}
                  </span>
              </div>   
            </div>            
        </div>
        <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        ${newReply}
    </div>   
    </div>`;
  });
  return feedHtml;
}

function render() {
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();
