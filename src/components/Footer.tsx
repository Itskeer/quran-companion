"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl">📖</span>
              <span className="font-semibold text-gray-800 dark:text-white">
                Quran<span className="text-emerald">Companion</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Helping you find comfort and connection through Quranic verses and authentic duas.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="/mood" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Mood</Link></li>
              <li><Link href="/quran" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Quran</Link></li>
              <li><Link href="/duas" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Duas</Link></li>
              <li><Link href="/dhikr" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Dhikr</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">About</Link></li>
              <li><Link href="/settings" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Settings</Link></li>
              <li><Link href="/favorites" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors">Favorites</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors cursor-pointer">Terms of Service</span></li>
              <li><span className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald transition-colors cursor-pointer">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Created by <span className="text-emerald font-semibold">Ahmed Jaballah</span>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xl mx-auto leading-relaxed">
              A web developer passionate about building clean, modern, and fast websites.
              Specializing in responsive sites using HTML, CSS, JavaScript, and React.
              Turning ideas into real, functional websites with a focus on design and performance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              © {new Date().getFullYear()} Quran Companion. Demo project.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Privacy</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer transition-colors">Terms</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
