import { db } from './config.js';
import { doc, collection, setDoc, getDoc, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';
import { auth } from './config.js';
import { onAuthStateChanged } from 'firebase/auth';

// Function to get the user's first name from Firestore
export async function getUserName(uid) {
    if (!uid) {
        return 'Hi, Stranger';
    }
    try {
        const user = await getDoc(doc(db, 'users', uid));
        return 'Hi, ' + user.data().firstname + ' ' + user.data().lastname;
    } catch (error) {
        console.error(error);
    }
}

// Function to display all songs dynamically
export async function loadSongs() {
    const songList = document.getElementById('song-list');
    songList.innerHTML = ''; // Clear the current list

    try {
        const songsCollection = collection(db, 'songs');
        const songsSnapshot = await getDocs(songsCollection);
        songsSnapshot.forEach(doc => {
            const song = doc.data();
            const songItem = document.createElement('li');
            songItem.textContent = `${song.title} by ${song.artist} (${song.year})`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => {
                deleteSong(doc.id);  // Delete the song from Firestore
            };
            
            songItem.appendChild(deleteButton);
            songList.appendChild(songItem);
        });
    } catch (error) {
        console.error(error);
    }
}

// Function to handle adding a new song
export async function handleAddSong(event) {
    event.preventDefault(); // Prevent form submission

    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const year = document.getElementById('year').value;
    const rating = document.getElementById('rating').value;

    if (!title || !artist || !year || !rating) {
        alert('All fields are required!');
        return;
    }

    try {
        const songRef = doc(db, 'songs', title);
        await setDoc(songRef, { title, artist, year, rating });
        loadSongs();  // Reload the song list after adding
    } catch (error) {
        console.error(error);
    }
}

// Function to handle deleting a song
export async function deleteSong(id) {
    try {
        await deleteDoc(doc(db, 'songs', id));
        loadSongs();  // Reload the song list after deletion
    } catch (error) {
        console.error(error);
    }
}

// Function to load user data and display the greeting message
export function loadUserData() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const firstName = await getUserName(user.uid);
            document.getElementById('user-greeting').textContent = `Hello, ${firstName}`;
            loadSongs();  // Load the songs after user is authenticated
        } else {
            document.getElementById('user-greeting').textContent = 'Hello, Stranger';
        }
    });
}

// Initialize the page (this will be called on page load)
window.onload = loadUserData;

// Attach the add song form handler
document.getElementById('add-song-form').addEventListener('submit', handleAddSong);
