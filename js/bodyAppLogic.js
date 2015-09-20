 function my_init() {
     easyrtc.setRoomOccupantListener( roomListener);
     easyrtc.easyApp("BodyAppClassVideo", "self", ["caller"], //(applicationName, a string containing the id of the first video tag, an array containing the id of the second video tag, callback)
         function(myId) { 
         //A map whose keys are the ids (easyrtcids) of the other people connected to the server using the same application name
         // in a real application, we wouldn't be using the easyrtcids for button labels. Instead, we would have some application logic to map the easyrtcids to more permanent identifiers like name, job title, and profile picture.
            console.log("My easyrtcid is " + myId);
         }
     );
 }

 function roomListener(roomName, otherPeers) {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    for(var i in otherPeers) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            }
        }(i);

        label = document.createTextNode(i);
        button.appendChild(label);
        otherClientDiv.appendChild(button);
    }
}

function performCall(easyrtcid) {
    easyrtc.call(easyrtcid,
        function(easyrtcid) { console.log("completed call to " + easyrtcid); },
        function(errorMessage) { console.log("err:" + errorMessage); },
        function(accepted, bywho) { console.log((accepted?"accepted":"rejected")+ " by " + bywho); }
    );
}