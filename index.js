import { tweetsData  as initialTweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/*
    elements controls
*/
let tweetsData = [...initialTweetsData];
const modal = document.getElementById('modal')
const modalCloseBtn = document.getElementById('modal-close-btn')
const consentForm = document.getElementById('consent-form')
const modalText = document.getElementById('modal-text')


/*
    Listener on click and submit
*/
modalCloseBtn.addEventListener('click', function(){
    modal.style.display = 'none'
})

consentForm.addEventListener('submit', function(e){
    e.preventDefault()
    const consentFormData = new FormData(consentForm)
    const eMail = consentFormData.get('email')
    

    modalText.innerHTML = `
    <div class="modal-inner-loading">
        <img src="images/load.svg" class="loading">
        <p id="upload-text"> En attente du transfert...</p>
    </div>` 
    setTimeout(function(){
        document.getElementById('upload-text').innerText = `
        Transaction effectuée...`
    }, 1500)
    setTimeout(function(){
        document.getElementById('modal-inner').innerHTML = `
        <h2>Les informations ont été envoyé à <span class="modal-display-name">${eMail}</span> Paiement Terminé! </h2>
        <div class="sent-gif">
            <img src="images/money.gif">
        </div>
    `
    }, 2500)
})

/*
    Click on pages elements
*/

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.inbox){
        handleInboxClick(e.target.dataset.inbox)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.trash){
        handleDeleteClick(e.target.dataset.trash)
    }
})
 
/*
    Functions controls
*/
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleInboxClick(tweetId){
    modal.style.display = 'inline'
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleDeleteClick(tweetId){
  tweetsData = tweetsData.filter(function(tweet){
    return tweet.uuid !== tweetId
  })
  render ()
}
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/logo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let commentIconClass = ''
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots ${commentIconClass}"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-inbox"
                    data-inbox="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span>
                    <i class="fa-solid fa-trash"
                    data-trash="${tweet.uuid}"
                    ></i>
                </span>
                
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

