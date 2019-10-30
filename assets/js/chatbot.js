

//---------------------------------- Credentials Section ----------------------------------//

// set the focus to the input box
document.getElementById("wisdom").focus();

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    // Provide your Pool Id here
    IdentityPoolId: 'us-east-1:9439fb82-d0c1-4023-b9c9-beae786f301a',
});

var lexruntime = new AWS.LexRuntime();
var lexUserId = 'chatbot-demo' + Date.now();
var sessionAttributes = {};




//---------------------------------- Chat Section ----------------------------------//
function pushChat() {

    // if there is text to be sent...
    var wisdomText = document.getElementById('wisdom');
    if (wisdomText && wisdomText.value && wisdomText.value.trim().length > 0) {

        // disable input to show we're sending it
        var wisdom = wisdomText.value.trim();
        wisdomText.value = '...';
        wisdomText.locked = true;

        // send it to the Lex runtime
        var params = {
            botAlias: '$LATEST',
            botName: 'ScienceBotPreAlpha',
            inputText: wisdom,
            userId: lexUserId,
            sessionAttributes: sessionAttributes
        };
        showRequest(wisdom);
        lexruntime.postText(params, function(err, data) {
            if (err) {
                console.log(err, err.stack);
                showError('Error:  ' + err.message + ' (see console for details)')
            }
            if (data) {
                // capture the sessionAttributes for the next cycle
                sessionAttributes = data.sessionAttributes;
                // show response and/or error/dialog status
                showResponse(data);
            }
            // re-enable input
            wisdomText.value = '';
            wisdomText.locked = false;
        });
    }
    // we always cancel form submission
    return false;
}

function showRequest(daText) {

    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("li");
    requestPara.Id = 'left';
    requestPara.className = 'left clearfix';

    // TODO Initial
    var chatbody = '<span class="chat-img pull-left">' +
        '<p data-letters="KS" data-type="st"></p></span>' +
        '<div class="chat-body clearfix"><p>'+daText+'</p></div>';
    requestPara.innerHTML = chatbody;
    conversationDiv.appendChild(requestPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;

}


function showResponse(lexResponse) {
console.log(lexResponse);

    var categories = lexResponse.responseCard.genericAttachments[0].buttons;


    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("li");
    requestPara.Id = 'right';
    requestPara.className = 'right clearfix';

    var chatbody = '<span class="chat-img pull-right">' +
        '<p data-letters="SB" data-type="ai"></p></span>' +
        '<div class="chat-body clearfix"><p>'+lexResponse.message+'</p></div>';

    requestPara.innerHTML = chatbody;
    conversationDiv.appendChild(requestPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function showError(daText) {

    var conversationDiv = document.getElementById('conversation');
    var requestPara = document.createElement("li");
    requestPara.Id = 'lexError';
    requestPara.className = 'lexError';

    var chatbody = '<span class="chat-img pull-right">' +
        '<p data-letters="SB" data-type="ai"></p></span>' +
        '<div class="chat-body clearfix"><p>'+daText+'</p></div>';
    requestPara.innerHTML = chatbody;
    conversationDiv.appendChild(requestPara);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;

}
