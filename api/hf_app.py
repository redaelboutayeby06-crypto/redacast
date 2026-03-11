# ─────────────────────────────────────────────────────────────
# VoiceClone AI — Hugging Face Spaces Backend
# ─────────────────────────────────────────────────────────────
#
# HOW TO DEPLOY THIS (takes ~20 minutes, totally free):
#
# 1. Go to  https://huggingface.co  and create a free account
# 2. Click your profile picture → "New Space"
# 3. Fill in:
#       Space name:  voiceclone-backend
#       License:     mit
#       SDK:         Gradio
#       Hardware:    CPU Basic (free)  ← important, choose free
# 4. Click "Create Space"
# 5. Inside your new Space, click "Files" tab → "Add file" → "Upload files"
# 6. Upload THIS file as:  app.py
# 7. Upload the requirements.txt file as:  requirements.txt
# 8. Wait 5–10 minutes for it to build (you'll see a log)
# 9. Once it says "Running", copy the URL from the top of the page
#    It will look like:  https://johndoe-voiceclone-backend.hf.space
#10. Open  src/pages/App.jsx  in VS Code
#11. Find the line that says:  const HF_URL = 'https://YOUR-USERNAME...'
#12. Replace it with your real URL + /api/predict
#    Example:  const HF_URL = 'https://johndoe-voiceclone-backend.hf.space/api/predict'
#
# ─────────────────────────────────────────────────────────────

import gradio as gr
import base64
import tempfile
import os

def clone_voice(text: str, audio_base64: str) -> str:
    """
    Takes text + base64 audio → returns base64 MP3 of cloned voice.
    """
    if not text or not audio_base64:
        return ""

    try:
        # Decode the incoming audio
        audio_bytes = base64.b64decode(audio_base64)

        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as ref_file:
            ref_file.write(audio_bytes)
            ref_path = ref_file.name

        # ── F5-TTS inference ──────────────────────────────────
        from f5_tts.infer.utils_infer import (
            load_model, load_vocoder,
            preprocess_ref_audio_text, infer_process
        )
        from f5_tts.model import DiT
        import soundfile as sf
        from io import BytesIO

        vocoder = load_vocoder()

        model_cfg = dict(
            dim=1024, depth=22, heads=16,
            ff_mult=2, text_dim=512, conv_layers=4
        )
        model = load_model(DiT, model_cfg, "F5TTS_Base")

        ref_audio, ref_text = preprocess_ref_audio_text(ref_path, "")

        audio, sr, _ = infer_process(
            ref_audio, ref_text, text,
            model, vocoder,
            cross_fade_duration=0.15,
            speed=1.0,
        )

        # Export as MP3 in memory
        buf = BytesIO()
        sf.write(buf, audio, sr, format='mp3')
        buf.seek(0)
        result = base64.b64encode(buf.read()).decode('utf-8')

        os.unlink(ref_path)
        return result

    except Exception as e:
        print(f"[VoiceClone] Error: {e}")
        raise gr.Error(f"Generation failed: {str(e)}")


# ── Gradio app (this is what Hugging Face runs) ──────────────
demo = gr.Interface(
    fn=clone_voice,
    inputs=[
        gr.Textbox(label="Text to synthesize"),
        gr.Textbox(label="Reference audio (base64 encoded)"),
    ],
    outputs=gr.Textbox(label="Output audio (base64 encoded MP3)"),
    title="VoiceClone AI Backend",
    description="F5-TTS zero-shot voice cloning API",
    allow_flagging="never",
)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)