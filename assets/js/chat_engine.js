class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.socket = io.connect("http://localhost:5000"); //io is a variable given by the socket file in the frontend part by socket.io asa it is included
    if (this.userEmail) {
      this.connectionHandler();
    }
  }
  connectionHandler() {
    this.socket.on("connect", function () {
      console.log("connection Established using sockets");
    });
  }
}
