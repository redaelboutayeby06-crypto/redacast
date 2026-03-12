import edge_tts
import asyncio
import base64
import json
import tempfile
import os
from http.server import BaseHTTPRequestHandler

VOICES = {
    'af_sky': 'en-US-AvaNeural',
    'af_bella': 'en-US-JennyNeural',
    'am_adam': 'en-US-AndrewNeural',
    'am_michael': 'en-US-GuyNeural',
    'bf_emma': 'en-GB-SoniaNeural',
    'bm_george': 'en-GB-RyanNeural',
    'bm_lewis': 'en-GB-LibbyNeural',
    'af_heart': 'en-US-EmmaNeural',
}

async def generate_audio(text, voice, speed):
    rate = f"+{int((speed - 1) * 100)}%" if speed >= 1 else f"{int((speed - 1) * 100)}%"
    communicate = edge_tts.Communicate(text, voice, rate=rate)
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as f:
        tmp_path = f.name
    await communicate.save(tmp_path)
    with open(tmp_path, 'rb') as f:
        audio_data = f.read()
    os.unlink(tmp_path)
    return base64.b64encode(audio_data).decode('utf-8')

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body)
            text = data.get('text', '')
            voice_id = data.get('voice', 'af_heart')
            speed = float(data.get('speed', 1.0))
            
            if not text.strip():
                self._send_error(400, 'No text provided')
                return
            
            voice = VOICES.get(voice_id, 'en-US-EmmaNeural')
            audio_b64 = asyncio.run(generate_audio(text, voice, speed))
            
            self._send_json(200, {
                'audio': f'data:audio/mp3;base64,{audio_b64}',
                'success': True
            })
            
        except Exception as e:
            self._send_error(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self._set_cors_headers()
        self.end_headers()

    def _set_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def _send_json(self, status, data):
        self.send_response(status)
        self._set_cors_headers()
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def _send_error(self, status, message):
        self._send_json(status, {'error': message, 'success': False})