import * as db from "./../services/database.mjs"

describe("database", () => {
  afterEach(async () => {
    await db.clear();
  });

  it("createUser", async () => {
    await db.createUser({ email: 'w1@test.com', name: "w1" });
    const user = await db.getUserInfo("w1@test.com")
    expect(user).toEqual(
      jasmine.objectContaining({ email: 'w1@test.com', name: "w1" })
    );
  });

  it("updateUserInfo", async () => {
    await db.createUser({ email: 'w1@test.com', name: "w1" });
    db.updateUserInfo('w1@test.com', {aboutMe: "lolol", avatar: 1, name: "w2"});
    const user = await db.getUserInfo("w1@test.com");
    expect(user).toEqual(
        jasmine.objectContaining({aboutMe: "lolol", avatar: 1, name: "w2"})
      ); 
  });

  it("createMessage", async () => {
    await db.createRoom({ host: "w1@test.com", title: "room1"});
    await db.createMessage({
        room: "room1",
        content: "just testing",
        user: "w1@test.com"
    });
    const messages = await db.getMessages("room1");
    expect(messages[0]).toEqual(
        jasmine.objectContaining({
            room: "room1",
            content: "just testing",
            user: "w1@test.com"
        })
    );
  });

  it("deleteMessage", async () => {
    const msgID = await db.createMessage({
        room: "room1",
        content: "just testing",
        user: "w1@test.com"
    });
    db.deleteMessage(msgID);
    const messages = await db.getMessages("room1");
    expect(messages.length).toEqual(0);
  });

  it("updateMessage", async () => {
    const msgID = await db.createMessage({
        room: "room1",
        content: "just testing",
        user: "w1@test.com"
    });
    await db.updateMessage(msgID, {content: "this is new content"});
    const messages = await db.getMessages("room1");
    expect(messages[0]).toEqual(jasmine.objectContaining({
        room: "room1",
        content: "this is new content",
        user: "w1@test.com"
    }));
  });

  it("createRoom", async () => {
    await db.createRoom({ host: "w1@test.com", title: "room1"});
    await db.createRoom({ host: "w1@test.com", title: "room2"});
    await db.createRoom({ host: "w1@test.com", title: "room3"});
    const rooms = await db.getRooms("w1@test.com")
    expect(rooms.length).toEqual(3);
  });

  it("deleteRoom", async () => {
    await db.createRoom({ host: "w1@test.com", title: "room1"});
    const msgID = await db.createMessage({
        room: "room1",
        content: "just testing",
        user: "w1@test.com"
    });
    let messages = await db.getMessages("room1");
    console.log("haha", messages[0])
    expect(messages.length).toEqual(1);
    await db.deleteRoom("room1")
    messages = await db.getMessages("room1");
    expect(messages.length).toEqual(0);
  });

  it("updateRoomTitle", async () => {
    await db.createRoom({ host: "w1@test.com", title: "room1"});
    const msgID = await db.createMessage({
        room: "room1",
        content: "just testing",
        user: "w1@test.com"
    });
    await db.updateRoomTitle("room1", {host: "w1@test.com", title: "updated-room"});
    const rooms = await db.getRooms("w1@test.com");
    expect(rooms[0]).toEqual(
        jasmine.objectContaining({ host: 'w1@test.com', title: "updated-room" })
    );
    let msgs = await db.getMessages("room1");
    expect(msgs.length).toEqual(0);
    msgs = await db.getMessages("updated-room");
    expect(msgs.length).toEqual(1);
  });

});