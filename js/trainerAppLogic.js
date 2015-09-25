// var activeBox = -1;  // nothing selected
// var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 10;
var numVideoOBJS = maxCALLERS+1;
// var layout;

easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "box" + boxNum;
}

function callEverybodyElse(roomName, otherPeople) {
    easyrtc.setRoomOccupantListener(null); // so we're only called once.

    var list = [];
    var connectCount = 0;
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
        function callSuccess() {
            connectCount++;
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure);

    }
    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}


function loginSuccess() {
    var username = "trainer"
    // easyrtc.emit("setUsername", username);
    // expandThumb(0);  // expand the mirror image initially.
}

function messageListener(easyrtcid, msgType, content) {
    for(var i = 0; i < maxCALLERS; i++) {
        if( easyrtc.getIthCaller(i) == easyrtcid) {
            var startArea = document.getElementById(getIdOfBox(i+1));
            var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
            var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;
            showMessage(startX, startY, content);
        }
    }
}

function appInit() {

    // Prep for the top-down layout manager
    // setReshaper('fullpage', reshapeFull);
    // for(var i = 0; i < numVideoOBJS; i++) {
        // prepVideoBox(i);
    // }
    // setReshaper('killButton', killButtonReshaper);
    // setReshaper('muteButton', muteButtonReshaper);
    // setReshaper('textentryBox', reshapeTextEntryBox);
    // setReshaper('textentryField', reshapeTextEntryField);
    // setReshaper('textEntryButton', reshapeTextEntryButton);

    // updateMuteImage(false);
    // window.onresize = handleWindowResize;
    // handleWindowResize(); //initial call of the top-down layout manager

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.setUsername("trainer")
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3", "box4", "box5", "box6", "box7", "box8"], loginSuccess);
    easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        console.log("getConnection count="  + easyrtc.getConnectionCount() );
        console.log("easyrtcid: " + easyrtcid);
        console.log("slot: " + slot);

        // boxUsed[slot+1] = true;
        // if(activeBox == 0 ) { // first connection
            // collapseToThumb();
            // document.getElementById('textEntryButton').style.display = 'block';
        // }
        document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";
        // handleWindowResize();
    });


    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
        // if(activeBox > 0 && slot+1 == activeBox) {
            // collapseToThumb();
        // }
        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
                // expandThumb(0);
                document.getElementById('textEntryButton').style.display = 'none';
                // document.getElementById('textentryBox').style.display = 'none';
            }
            // handleWindowResize();
        },20);
    });
}