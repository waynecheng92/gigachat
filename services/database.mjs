import fsPromises from 'fs/promises'
import firebaseApp from "../firebase.js";
import { getFirestore, collection, doc, addDoc, getDocs, 
    getDoc, deleteDoc, updateDoc, setDoc, query, where } from "firebase/firestore"; 

const db = getFirestore(firebaseApp);

/*
    user = {
        email: 'admin@gmail.com',
        name: 'admin',
        aboutMe: 'This is my about me!',
        avatar: 'https://firebase-cdn.firebase.app'
    }
*/
export const createUser = async (userEmail) => {
    const newUser = {
        email: userEmail,
        // we don't need to store username, because it is already in the user object in the frontend
        // name: userData.name,
        aboutMe: "Talk about yourself here!",
        avatar: 0
    };
    await setDoc(doc(db, "users", userEmail), newUser);
    return newUser;
};

export const getUserInfo = async (email) => { 
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
};

export const updateUserInfo = async (email, userData) => {
    const userRef = doc(db, "users", email);
    await updateDoc(userRef, {
        ...userData,
    });
};

export const getRooms = async (email) => {
    let res = [];
    const q = query(collection(db, "rooms"), where("host", "==", email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        res.push({
            title: doc.id,
            ...doc.data(),
        });
    });
    return res;
};

export const get10RandomRooms = async (numberOfRooms = 10) => {
    const q = query(collection(db, 'rooms'));
    const querySnapshot = await getDocs(q);

    // Collect all rooms
    const allRooms = [];
    querySnapshot.forEach((doc) => {
        allRooms.push({
            title: doc.id,
            ...doc.data(),
        });
    });

    // Shuffle and select `numberOfRooms` random rooms
    const shuffledRooms = allRooms.sort(() => 0.5 - Math.random());
    return shuffledRooms.slice(0, numberOfRooms);
};

export const updateRoomTitle = async (oldTitle, roomData) => {
    const q = query(collection(db, "messages"), where("room", "==", oldTitle));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((message) => {
        updateMessage(message.id, {room: roomData.title});
    });
    await deleteRoom(oldTitle);
    await createRoom(roomData);
};

export const deleteRoom = async (title) => {
    const q = query(collection(db, "messages"), where("room", "==", title));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((message) => {
        deleteMessage(message.id);
    });
    await deleteDoc(doc(db, "rooms", title));
};

export const createRoom = async (roomData) => { 
    const newRoom = {
        ...roomData,
    };
    await setDoc(doc(db, "rooms", roomData.title), newRoom);
    return newRoom;
};


export const getMessages = async (roomID) => {
    let res = [];
    const q = query(collection(db, "messages"), where("room", "==", roomID));
    const querySnapshot = await getDocs(q);

    const profilePics = new Map();
    for (const document of querySnapshot.docs) {
        const data = document.data();
        if (!profilePics.has(data.user)) {
            const docRef = doc(db, "users", data.user);
            const docSnap = await getDoc(docRef);
            profilePics.set(data.user, docSnap.data().avatar);
            console.log(data.user)
        }
        res.push({
            id: document.id,
            avatar: profilePics.get(data.user),
            ...data,
        })
    }
    
    return res;
};


/*
    message: {
        time: 'today',
        room: 'room1',
        content: 'this is a message!',
        user: 'admin@gmail.com'
    }
*/
export const createMessage = async (msgData) => { 
    const newMsg = {
        time: Date.now(),
        ...msgData,
    };
    const docRef = await addDoc(collection(db, "messages"), newMsg);
    // console.log("Document written with ID: ", docRef.id, newMsg);
    return docRef.id;
};

export const deleteMessage = async (msgID) => { 
    await deleteDoc(doc(db, "messages", msgID));
};

export const updateMessage = async (msgID, newContent) => { 
    const msgRef = doc(db, "messages", msgID);
    await updateDoc(msgRef, {
        content: newContent,
    });
};
