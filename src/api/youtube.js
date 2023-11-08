import axios from 'axios';
const KEY = "AIzaSyCudj37bf7-uNT8tYA1GscfijHf-dRlfs4";

export default axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/",
    params: {
        part: 'snippet',
        id: 'SqcY0GlETPk',
        key: KEY
    }
})