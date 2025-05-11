const apiKey = "yZBoCo3AUd90tinODeg4X51CTXcUZsRQ76meymtZ";

function fetchAPOD() {
    const date = document.getElementById('dateInput').value;
    let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    if (date) {
        url += `&date=${date}`;
    }

    // Show loader and hide content
    document.getElementById('loader').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('downloadBtn').style.display = 'none';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('No data found for the selected date.');
            }
            return response.json();
        })
        .then(data => {
            const imageEl = document.getElementById('image');

            if (data.media_type === 'image') {
                imageEl.src = data.url;
                imageEl.style.display = 'block';
                document.getElementById('downloadBtn').style.display = 'inline-block';
            } else {
                imageEl.style.display = 'none';
                document.getElementById('downloadBtn').style.display = 'none';
            }

            document.getElementById('title').innerText = data.title;
            document.getElementById('description').innerText = data.explanation;
            document.getElementById('date').innerText = `Date: ${data.date}`;

            // Show content and hide loader
            document.getElementById('loader').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching NASA APOD:', error);
            alert(`Unable to fetch data: ${error.message}`);
            document.getElementById('loader').style.display = 'none';
            document.getElementById('content').style.display = 'none';
        });
}

// Download the image function
function downloadImage() {
    const imageUrl = document.getElementById('image').src;

    // Extract the filename from the image URL
    const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);

    fetch(imageUrl, { mode: 'no-cors' }) // some servers allow this; if not, remove it
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageName; // Use the extracted image name
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('Error downloading image:', error);
            alert('Unable to download this image. NASA may be blocking direct downloads.');
        });
}


// Fetch today's APOD by default when the page loads
window.onload = fetchAPOD;
