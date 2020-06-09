import firebase from './firebase';

export const Functions = {

  readData(collection, callback) {
    firebase.firestore()
      .collection(collection)
      .onSnapshot(onSnapshot => {
        const newObj = onSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }))
        callback(newObj);
      })
  },

  createData(collection, obj) {
    firebase.firestore()
      .collection(collection)
      .add(obj)
  },

  updateData(collection, id, obj) {
    firebase
      .firestore()
      .collection(collection)
      .doc(id)
      .update(obj)
  },

  deleteData(collection, id) {
    firebase
      .firestore()
      .collection(collection)
      .doc(id)
      .delete()

  }
}