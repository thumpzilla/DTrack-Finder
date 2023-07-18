export default class FirebaseManager {
  constructor() {
    if (FirebaseManager.instance) {
      return FirebaseManager.instance;
    }

    this.db = null;
    this.user = null;
    FirebaseManager.instance = this;
  }

  // Method to get firestore instance
  getDb() {
    if (!this.db) {
      this.db = firebase.firestore();
    }
    return this.db;
  }
  setUser(user) {
    this.user = user;
  }

  // Method to add a favorite song
  async addFavorite(songName, artist) {
    return await this.getDb()
      .collection("favorites")
      .doc(this.user.uid)
      .set(
        {
          [`${songName}-${artist}`]: {
            songName: songName,
            artist: artist,
          },
        },
        { merge: true }
      );
  }

  // Method to get all favorite songs
  async getFavorites() {
    const favoritesSnapshot = await this.getDb()
      .collection("favorites")
      .doc(this.user.uid)
      .get();
    return favoritesSnapshot.exists ? favoritesSnapshot.data() : {};
  }

  // Method to remove a favorite song
  async removeFavorite(songName, artist) {
    return await this.getDb()
      .collection("favorites")
      .doc(this.user.uid)
      .update({
        [`${songName}-${artist}`]: firebase.firestore.FieldValue.delete(),
      });
  }
}
