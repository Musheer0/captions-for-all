'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, Play, Zap, Languages, Film, Sparkles, Mail, Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Captions4All logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="font-bold text-lg text-foreground">Captions4All</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground/70 hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition">How it works</a>
            <a href="#pricing" className="text-foreground/70 hover:text-foreground transition">Pricing</a>
           <Link href={"/videos"}>
            <Button size="sm" className="rounded-full">Get Started</Button>
           </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsNavOpen(!isNavOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="md:hidden bg-card border-b border-border/50 p-4 space-y-3">
          <a href="#features" className="block text-foreground/70 hover:text-foreground">Features</a>
          <a href="#how-it-works" className="block text-foreground/70 hover:text-foreground">How it works</a>
          <a href="#pricing" className="block text-foreground/70 hover:text-foreground">Pricing</a>
          <Button size="sm" className="w-full rounded-full">Get Started</Button>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
            <span className="text-sm font-medium text-primary">✨ AI-Powered Video Magic</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight text-balance">
            Add Captions to Your Videos <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">in Any Language</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto text-balance leading-relaxed">
            Automatically generate accurate captions powered by AI. Support for 100+ languages. Reach creators worldwide and boost accessibility in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href={'/videos'}>
            <Button size="lg" className="rounded-full px-8">
              Start for Free <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              <Play className="w-4 h-4 mr-2" /> See Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-border/30">
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">10K+</div>
              <p className="text-sm text-foreground/60">Videos Processed</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">100+</div>
              <p className="text-sm text-foreground/60">Languages Supported</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">50K+</div>
              <p className="text-sm text-foreground/60">Hours Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Powerful Features for Captioning</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Everything you need to add professional captions to any video</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Caption Generation</h3>
              <p className="text-foreground/60">Automatic speech-to-text transcription powered by WhisperX. Accurate, fast, and industry-leading accuracy.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Languages className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Multi-Language Support</h3>
              <p className="text-foreground/60">Translate captions to 100+ languages instantly. Reach global audiences and boost accessibility.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Flexible Subtitle Formats</h3>
              <p className="text-foreground/60">Choose hard subtitles (burned in) or soft subtitles (editable SRT/VTT). Full control and compatibility.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Custom Styling</h3>
              <p className="text-foreground/60">Personalize caption colors, fonts, and positioning. Match your brand and video aesthetic perfectly.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Batch Processing</h3>
              <p className="text-foreground/60">Process multiple videos at once. Save time and caption your entire backlog efficiently.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Instant Delivery</h3>
              <p className="text-foreground/60">Get your captioned videos via email. Ready to download and use immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Three Steps to Perfect Captions</h2>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Upload, configure, and download. That's it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative space-y-4">
              <div className="absolute -top-4 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">1</div>
              <div className="pt-8 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Upload Your Video</h3>
                <p className="text-foreground/60">Drag and drop or select your video files. Support for videos up to 1GB. Process multiple videos at once.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative space-y-4">
              <div className="absolute -top-4 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">2</div>
              <div className="pt-8 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Configure Captions</h3>
                <p className="text-foreground/60">Select language, subtitle style (hard or soft), font, and colors. Customize to match your brand.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative space-y-4">
              <div className="absolute -top-4 left-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">3</div>
              <div className="pt-8 space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Download & Use</h3>
                <p className="text-foreground/60">Get your captioned videos via email or download directly. Ready to share or upload to any platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <Zap className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">AI Powered</h3>
              <p className="text-foreground/60">State-of-the-art AI models for captions and clip detection</p>
            </div>
            <div className="space-y-3">
              <Sparkles className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Fast Processing</h3>
              <p className="text-foreground/60">GPU-accelerated processing for near-instant results</p>
            </div>
            <div className="space-y-3">
              <Film className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-foreground">Secure & Private</h3>
              <p className="text-foreground/60">Your videos are encrypted and never shared</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Simple, Transparent Pricing</h2>
            <p className="text-lg text-foreground/60">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="p-8 rounded-xl bg-background border border-border/50 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Free</h3>
                <p className="text-foreground/60">Perfect for getting started</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>5 videos per month</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>100+ languages</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Soft subtitles only</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Basic styling options</span>
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full">Get Started</Button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-purple-600/10 border border-primary/30 space-y-6 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-bold text-foreground">Pro</h3>
                <p className="text-foreground/60">For creators who caption regularly</p>
              </div>
              <div className="relative z-10 space-y-1">
                <p className="text-4xl font-bold text-foreground">$29<span className="text-lg text-foreground/60">/mo</span></p>
              </div>
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Unlimited videos</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>100+ languages</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Hard + Soft subtitles</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Advanced styling & customization</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <ChevronRight className="w-5 h-5 text-primary" />
                  <span>Priority support</span>
                </div>
              </div>
              <Button className="w-full rounded-full relative z-10">Start Free Trial</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-r from-primary/10 to-purple-600/10 p-12 rounded-2xl border border-primary/20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">Ready to Add Captions to Your Videos?</h2>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">Start captioning in 100+ languages today. Reach more viewers. No credit card required.</p>
         <Link href={"/videos"}>
          <Button size="lg" className="rounded-full px-8">Start Captioning for Free</Button>
         </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Captions4All logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="font-bold text-foreground">Captions4All</span>
              </div>
              <p className="text-foreground/60 text-sm">AI-powered video captioning and clipping for creators</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">Features</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">Pricing</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">Documentation</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="text-foreground/60 hover:text-foreground transition">API</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Follow</h4>
              <div className="flex gap-4">
                <a href="https://x.com/musheer_an" className="text-foreground/60 hover:text-foreground transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://github.com/Musheer0" className="text-foreground/60 hover:text-foreground transition">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-sm text-foreground/60 text-center">
            <p>&copy; 2026 Captions4All. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
