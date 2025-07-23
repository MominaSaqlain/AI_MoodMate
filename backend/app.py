from flask import Flask, request, jsonify, send_from_directory
from textblob import TextBlob
from flask_cors import CORS
from deepface import DeepFace
import json
import os

app = Flask(__name__)
CORS(app)

# Mood to genre mapping
mood_genres = {
    'happy': 'Pop',
    'sad': 'Acoustic',
    'angry': 'Rock',
    'calm': 'Lo-fi'
}

# Extended mapping for face mood detection
mood_mapping = {
    'happy': 'Pop',
    'sad': 'Acoustic',
    'angry': 'Rock',
    'fear': 'Lo-fi',
    'surprise': 'Pop',
    'neutral': 'Lo-fi',
    'disgust': 'Rock'
}

# Load song data from JSON file
with open('../static/sample_songs.json') as f:
    songs_data = json.load(f)

# ------------------------------
# Route 1: Home route (optional)
@app.route('/')
def home():
    return '🎧 MoodMate API is running. Use /analyze or /analyze_image.'

# ------------------------------
# Route 2: Mood detection from text
@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data.get('text', '')
    mood = get_sentiment(text)
    genre = mood_genres.get(mood.lower(), 'Pop')
    songs = songs_data.get(genre.lower(), [])

    return jsonify({
        'mood': mood,
        'songs': songs
    })

# ------------------------------
# Function to detect mood from text
def get_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity

    if polarity > 0.5:
        return 'happy'
    elif polarity < -0.3:
        return 'sad'
    elif -0.3 <= polarity <= 0.1:
        return 'calm'
    else:
        return 'angry'

# ------------------------------
# Route 3: Mood detection from image
@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    image = request.files['image']
    image_path = 'uploaded_image.jpg'
    image.save(image_path)

    try:
        analysis = DeepFace.analyze(
            img_path=image_path,
            actions=['emotion'],
            enforce_detection=False,
            detector_backend='opencv'
        )
        mood = analysis[0]['dominant_emotion']
        print("Detected mood:", mood)
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': 'Could not analyze image'}), 500

    genre = mood_mapping.get(mood.lower(), 'Pop')
    songs = songs_data.get(genre.lower(), [])

    return jsonify({
        'mood': mood,
        'songs': songs
    })

# ------------------------------
# Start the server
if __name__ == '__main__':
    app.run(debug=True)
