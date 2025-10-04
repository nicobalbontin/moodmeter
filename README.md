# 🎭 MoodMeter

A beautiful, real-time mood sharing application for teams during online meetings. Share your emotional state with teammates using an intuitive 10×10 emotion grid based on the Energy-Pleasantness model.

![MoodMeter Preview](https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- **100 Emotion Options**: Based on the Energy-Pleasantness psychological model
- **Real-time Updates**: See your teammates' moods instantly using Supabase real-time
- **No Authentication**: Simple, open access - just enter your name
- **Multi-user Support**: Multiple people can select the same mood (shows as color stripes)
- **Session Persistence**: Your name and color are saved across page refreshes
- **Beautiful UI**: Modern, glassmorphic design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd moodmeter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database:**
   ```bash
   # Link to your Supabase project
   supabase link --project-ref your_project_ref

   # Push the migration
   supabase db push
   ```

5. **Enable Real-time in Supabase:**
   - Go to your Supabase Dashboard
   - Navigate to **Database** → **Replication**
   - Enable real-time for the `mood_selections` table

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎨 How It Works

### The Emotion Grid

The grid is organized by two axes:
- **Y-axis (Vertical)**: Energy level (High at top, Low at bottom)
- **X-axis (Horizontal)**: Pleasantness (Low on left, High on right)

This creates four distinct quadrants:
- 🔴 **Top-Left**: High Energy, Low Pleasantness (e.g., Enraged, Anxious, Stressed)
- 🟡 **Top-Right**: High Energy, High Pleasantness (e.g., Ecstatic, Excited, Happy)
- 🔵 **Bottom-Left**: Low Energy, Low Pleasantness (e.g., Sad, Depressed, Tired)
- 🟢 **Bottom-Right**: Low Energy, High Pleasantness (e.g., Calm, Peaceful, Serene)

### User Flow

1. **First Visit**: Click any mood → Enter your name → Get assigned a random pastel color
2. **Return Visits**: Your name and color are remembered via localStorage
3. **Change Mood**: Click any other mood to update (real-time for all users)
4. **See Others**: View all team members and their moods at the bottom

## 🏗️ Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Real-time)
- **Deployment**: [Vercel](https://vercel.com/) (recommended)

## 📁 Project Structure

```
moodmeter/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Main page with mood grid
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── MoodCard.tsx        # Individual mood card
│   │   ├── MoodGrid.tsx        # 10×10 grid with axis labels
│   │   ├── UserList.tsx        # Bottom user display
│   │   └── UserNameModal.tsx   # Name input modal
│   ├── hooks/
│   │   └── useMoodData.ts      # Real-time data hook
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── constants.ts        # Mood grid data
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # TypeScript types
├── supabase/
│   └── migrations/             # Database migrations
└── public/                     # Static assets
```

## 🔒 Database Schema

```sql
mood_selections (
  id: UUID (primary key)
  user_name: TEXT
  user_color: TEXT (hex color)
  selected_mood: TEXT
  session_id: TEXT (unique identifier)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/moodmeter)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for your team!

## 🙏 Acknowledgments

- Emotion grid based on the Russell's Circumplex Model of Affect
- Inspired by team mood check-in practices

---

**Made with ❤️ for better team communication**
