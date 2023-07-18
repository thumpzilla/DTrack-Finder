export default class FirebaseManager {
  constructor() {
    if (FirebaseManager.instance) {
      return FirebaseManager.instance;
    }

    this.db = null;
    this.user = null;
    this.favoritesToAdd = {};
    this.favoritesToRemove = {};
    FirebaseManager.instance = this;

    this.syncFavorites = this.debounce(this.syncFavorites.bind(this), 10000);
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

  // add a song to favoritesToAdd and call the debounced function
  addFavorite(songName, artist) {
    const key = `${songName}-${artist}`;

    // if the song is in the remove list, remove it from there
    if (this.favoritesToRemove[key]) {
      delete this.favoritesToRemove[key];
    } else {
      // otherwise, add it to the add list
      this.favoritesToAdd[key] = {
        songName: songName,
        artist: artist,
      };
    }

    this.syncFavorites();
  }

  // remove a song from the favorites
  removeFavorite(songName, artist) {
    const key = `${songName}-${artist}`;

    // if the song is in the add list, remove it from there
    if (this.favoritesToAdd[key]) {
      delete this.favoritesToAdd[key];
    } else {
      // otherwise, add it to the remove list
      this.favoritesToRemove[key] = true;
    }

    this.syncFavorites();
  }

  // this function will be called at most once every 10 seconds
  async syncFavorites() {
    if (this.user) {
      try {
        const batch = this.getDb().batch();

        // Add favorites
        for (let key in this.favoritesToAdd) {
          const favRef = this.getDb()
            .collection("users")
            .doc(this.user.uid)
            .collection("favorites")
            .doc(key);
          batch.set(favRef, this.favoritesToAdd[key]);
        }

        // Remove favorites
        for (let key in this.favoritesToRemove) {
          const favRef = this.getDb()
            .collection("users")
            .doc(this.user.uid)
            .collection("favorites")
            .doc(key);
          batch.delete(favRef);
        }

        await batch.commit();

        this.favoritesToAdd = {};
        this.favoritesToRemove = {};
      } catch (error) {
        console.error("Error syncing favorites: ", error);
        // handle the error
      }
    }
  }

  // Method to get all favorite songs
  async getFavorites() {
    try {
      const favoritesSnapshot = await this.getDb()
        .collection("users")
        .doc(this.user.uid)
        .collection("favorites")
        .get();
      return favoritesSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error getting favorites: ", error);
      // handle the error
    }
  }

  // debounce function
  debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }
}
