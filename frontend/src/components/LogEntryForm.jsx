import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ImagePlus, Send, Loader2, X } from 'lucide-react';

const LogEntryForm = ({ onEntryAdded }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    setIsSubmitting(true);
    try {
      const payload = {
        type: image ? 'image' : 'text',
        content: image || text
      };

      const response = await axios.post('/api/diary/log', payload);
      if (response.data.success) {
        onEntryAdded(response.data.data);
        setText('');
        removeImage();
      }
    } catch (error) {
      console.error('Failed to log entry', error);
      alert('Failed to log entry. See console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-vibeWhite p-6 rounded-2xl shadow-sm border border-vibePink/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        {!image && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's the vibe today?"
            className="w-full bg-transparent resize-none outline-none text-textDark placeholder:text-textMuted/60 text-lg"
            rows={3}
          />
        )}
        
        {previewUrl && (
          <div className="relative inline-block">
            <img src={previewUrl} alt="Preview" className="h-48 rounded-lg object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-textDark/50 text-white rounded-full hover:bg-textDark transition"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-vibePink">
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
              disabled={!!text.trim()} // Disable image if text is typed
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!!text.trim() || isSubmitting}
              className="p-2 text-accentPink hover:bg-vibePink rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add a photo dump"
            >
              <ImagePlus size={24} />
            </button>
            <span className="text-xs text-textMuted">
              {!text.trim() ? "Photo or text (one at a time)" : "Clear text to add photo"}
            </span>
          </div>

          <button
            type="submit"
            disabled={(!text.trim() && !image) || isSubmitting}
            className="flex items-center gap-2 bg-accentOrange hover:bg-orange-500 text-white px-6 py-2 rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            Log Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogEntryForm;
