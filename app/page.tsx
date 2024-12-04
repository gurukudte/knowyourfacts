import { Button } from "@/components/ui/button";

/**
 * Home Page Component
 * 
 * This is the main landing page component for the Know Your Facts platform.
 * It provides an overview of the platform's key features and calls-to-action
 * for users to explore content or contribute.
 * 
 * Component Structure:
 * - Hero Section: Main headline, description, and primary CTAs
 * - Features Section: Three key features displayed in a grid
 * - CTA Section: Final call-to-action for user registration
 * 
 * Key Features Highlighted:
 * 1. Technical Articles
 * 2. Development Tools
 * 3. Community Engagement
 * 
 * Navigation Links:
 * - /explore: Takes users to content exploration page
 * - /share: Takes users to resource sharing page
 * - /register: Takes users to registration page
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Know Your Facts
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Your go-to platform for discovering and sharing developer tools,
            articles, and technical insights. Build better, learn faster.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg" className="text-lg">
              <a href="/explore">Explore Content</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <a href="/share">Share Resource</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Technical Articles</h3>
            <p className="text-gray-600">
              Discover in-depth technical articles written by developers for
              developers.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dev Tools</h3>
            <p className="text-gray-600">
              Find and share the best development tools to boost your
              productivity.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-white shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Join the discussion, share your knowledge, and learn from fellow
              developers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to contribute?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Share your knowledge and help build a better developer community.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="text-lg">
              <a href="/register">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
