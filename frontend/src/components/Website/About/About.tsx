import React from 'react';
import { Target, Eye, Globe, Zap, CalendarDays, LineChart, Clock, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-24 font-sans">
      <div className="max-w-420 mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 text-brand-blue font-bold text-sm tracking-widest uppercase mb-6">
            <Globe size={18} /> About Us
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-brand-black mb-8 tracking-tight">UpDownLive</h1>
          <p className="text-xl text-brand-gray leading-relaxed font-medium">
            Updownlive.com, a premier provider of free news and fundamental research, is one of the world's leading sources for news and analysis in the currency, commodity, and index trading communities.
          </p>
          <p className="text-lg text-brand-gray leading-relaxed mt-4">
            Our analysts report every day on the latest changes in the financial markets, providing timely fundamental, economic, and technical analysis, as well as a close examination of promising chart formations with live currency quotes. Updownlive also offers expert analysis of market movements, explaining the economic, political, and technical factors driving the markets.
          </p>
        </div>

        {/* Forex News Section */}
        <div className="mb-24 bg-brand-light p-10 md:p-14 rounded-3xl border border-brand-border">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-brand-black mb-6 flex items-center gap-3">
                <Zap className="text-brand-blue" size={32} /> Forex News
              </h2>
              <p className="text-lg text-brand-gray leading-loose">
                Our News service breaks market-moving news faster and more consistently than any other internet source, making it the go-to destination for understanding daily, hourly, and minute-by-minute market drivers. Even when news isn't breaking, our platform serves as an intelligent curation of the financial media's most insightful stories, making it easy for traders to follow the global news flow. Combined with an editorial team working 24 hours a day, our unique approach results in a news feed that is high in value, low in noise, and tailored specifically to forex traders.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-brand-black mb-4">Features</h2>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto">
               Updownlive analysts report daily on the latest changes in the currency market, providing timely technical analysis and a close examination of promising chart formations alongside live currency quotes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Economic Calendar */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
                <CalendarDays size={28} />
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">Economic Calendar</h3>
              <p className="text-brand-gray leading-relaxed text-lg">
                A complete release schedule of news events from G-10 countries, featuring advanced filtering capabilities to rank each event by its market importance.
              </p>
            </div>

            {/* Technical Analysis */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red mb-6">
                <LineChart size={28} />
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">Technical Analysis</h3>
              <p className="text-brand-gray leading-relaxed text-lg">
                Our daily technical analysis articles identify major trends and trading opportunities. These insights include daily charts highlighting key market moves and critical technical levels.
              </p>
            </div>

            {/* Real-Time News */}
            <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-brand-black/10 flex items-center justify-center text-brand-black mb-6">
                <Clock size={28} />
              </div>
              <h3 className="text-2xl font-bold text-brand-black mb-4">Real-Time News</h3>
              <p className="text-brand-gray leading-relaxed text-lg">
                Watch the clock tick down to enter the market and actively trade in fast-moving conditions. Be ready to act the moment new data is released.
              </p>
            </div>
          </div>
        </div>

        {/* Mission, Vision, and Values Section */}
        <div className="bg-brand-black text-white rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-red rounded-full opacity-20 blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto mb-16">
            <Award size={48} className="text-brand-blue mx-auto mb-6" />
            <h2 className="text-4xl font-extrabold mb-6">Our Mission, Vision, and Values</h2>
            <p className="text-white/80 text-xl leading-relaxed">
              Updownlive is a leading provider of information and resources for forex traders. Established in 2000, Updownlive offers comprehensive tools to help traders make more informed decisions when entering the market by providing an objective, unbiased view.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Target className="text-brand-red" size={28} /> Our Mission
              </h3>
              <p className="text-white/90 leading-relaxed text-lg">
                To create opportunities for professional growth for our audience—from beginners to advanced forex traders—and for our collaborators and partners, including banks, educators, independent analysts, data providers, and brokers. We deliver the most advanced information and tools, such as real-time rates, charting software, market analysis, forex news, economic calendars, and webinars, bringing together a wide variety of resources so traders can navigate the markets with confidence.
              </p>
            </div>
            
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Eye className="text-brand-blue" size={28} /> Our Vision
              </h3>
              <p className="text-white/90 leading-relaxed text-lg">
                To be the industry's leading provider of information and resources for forex traders, offering a consistently objective and transparent view of the markets.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
