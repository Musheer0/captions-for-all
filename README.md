# Captions4All

Captions4All is a video captioning and clipping platform that enables creators to upload videos, generate captions in their preferred language, and automatically clip viral-worthy segments from their content.

## Features

### Video Upload
- Drag-and-drop multi-file upload support
- Direct browser-to-storage uploads via presigned URLs
- Support for videos up to 1GB per file
- Batch upload with progress tracking

### Caption Generation
- Automatic speech-to-text transcription using WhisperX
- Translation to 100+ languages via Lingo.dev API
- Two subtitle styles:
  - **Hard Subtitles**: Permanently burned into the video
  - **Soft Subtitles**: SRT stream metadata (editable/toggleable)
- Multi-step workflow with language and style selection

### Video Clipping
- AI-powered clip selection using Gemini
- Automatic detection of viral-worthy segments (5-60 seconds)
- Generates catchy titles for clips
- Batch clipping (up to 6 clips per video)
- Non-edited clips ready for further customization

### Notifications
- Email notifications when processing completes
- Download links for generated content

## Tech Stack

### Frontend
- Next.js 16 with React 19
- TypeScript
- Tailwind CSS v4 with shadcn/ui
- Zustand for state management
- tRPC v11 with TanStack React Query
- Clerk for authentication
- Inngest for background job processing
- Nodemailer for email notification on video processing status
### Backend (Python)
- FastAPI
- WhisperX for speech-to-text
- Gemini AI for clip analysis
- FFmpeg for video processing
- Modal for serverless GPU deployment

### Infrastructure
- PostgreSQL with Prisma ORM
-  Tigris S3  for video storage
- Tigris S3 S3-compatible API

## Project Structure

```
/
├── backend/                # Python FastAPI backend (Modal)
│   └── src/
│       ├── app.py         # Main API endpoints
│       └── libs/          # Backend utilities
│           ├── burn_captions.py       # FFmpeg caption burning
│           ├── clip_video.py          # Video clipping logic
│           ├── extract_clips_transcribe.py  # AI clip selection
│           ├── schemas.py             # Pydantic models
│           ├── srt_utils.py           # SRT subtitle utilities
│           └── translate_captions.py  # Translation functions
│
├── prisma/
│   └── schema.prisma      # Database schema
│
└── src/                   # Next.js frontend
    ├── app/               # App Router pages
    ├── features/          # Feature modules
    │   ├── videos/        # Video upload
    │   ├── translate-captions/  # Caption generation
    │   ├── clip-videos/   # Video clipping
    │   └── dashboard/     # Layout components
    ├── inngest/           # Background job functions
    ├── trpc/              # tRPC API routers
    └── lib/               # Utilities and helpers
```

## API Endpoints

### Video Operations
| Endpoint | Type | Description |
|----------|------|-------------|
| `video.getUploadUrl` | mutation | Get presigned S3 upload URL |
| `video.getVideos` | query | List uploaded videos |
| `video.getGeneratedVideos` | query | List generated videos |
| `video.deleteVideo` | mutation | Delete a video |
| `video.clip_video` | mutation | Trigger video clipping |

### Caption Operations
| Endpoint | Type | Description |
|----------|------|-------------|
| `captions.addCaptions` | mutation | Start caption generation |

### Clip Operations
| Endpoint | Type | Description |
|----------|------|-------------|
| `clips.getClips` | query | List all clip groups |
| `clips.getClipsByVideo` | query | Get clips for specific video |

## Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL database
- Cloudflare R2 account

### Environment Variables

Create a `.env` file with:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Translation API
LINGO_API_KEY=lingo_sk_...

# Cloudflare R2 Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_ENDPOINT_URL_S3=https://t3.storage.dev
BUCKET_NAME=your-bucket-name

# Backend API
BACKEND_API_KEY=...
API_URL=https://your-modal-endpoint.modal.run/

# Email (Gmail SMTP)
APP_USER=your-email@gmail.com
APP_PASSWORD=your-app-password

# Database
DATABASE_URL=postgres://...
```

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npx prisma generate
```

3. Push database schema:
```bash
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

## Usage

### Uploading Videos
1. Navigate to the dashboard
2. Click the upload dialog or drag files directly
3. Wait for upload confirmation

### Adding Captions
1. Select video(s) from your library
2. Choose target language from 100+ options
3. Select subtitle style (soft or hard)
4. Submit and wait for email notification

### Creating Clips
1. Go to the clipper section
2. Select a video
3. Choose number of clips (1-6)
4. Submit and wait for AI analysis
5. Receive clipped segments via email

## Database Schema

### Video
Stores user uploads and generated content
- id, original_file_name, size, user_id
- object_key, lang, status, type

### Caption
Stores extracted and translated captions
- id, object_key, lang, video_id
- isOriginal flag

### VideoGeneration
Stores captioned video outputs
- id, object_key, lang, video_id, caption_id
- burn_type, type

### Clip
Stores clip group metadata
- id, video_id, user_id, video_name, clips_count

## License

Proprietary - All rights reserved
