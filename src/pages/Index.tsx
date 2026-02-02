import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Map, Route, Users, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  const { isAuthenticated, user } = useAuth();

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/route-search'} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Map className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">RuteKita</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <Route className="h-4 w-4" />
            Powered by Dijkstra's Algorithm
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up">
            Optimize Your Delivery Routes with{' '}
            <span className="text-primary">Intelligent GIS</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            RuteKita uses advanced pathfinding algorithms and OpenStreetMap data to calculate
            the shortest routes for your logistics operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-accent text-lg px-8 py-4">
              Start 
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Everything you need to optimize your delivery operations
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Route className="h-8 w-8" />,
                title: 'Shortest Path Calculation',
                description:
                  "Dijkstra's algorithm finds the optimal route between any two points on the map.",
              },
              {
                icon: <Map className="h-8 w-8" />,
                title: 'Interactive Maps',
                description:
                  'Click on the map to set origin and destination, or select from your customer list.',
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Customer Management',
                description:
                  'Store and manage your customer locations for quick route planning.',
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Role-Based Access',
                description:
                  'Separate dashboards for administrators and delivery officers.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                title: 'Real-Time Estimation',
                description:
                  'Get accurate distance and travel time estimates for your routes.',
              },
              {
                icon: (
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: 'Fast Processing',
                description:
                  'Millisecond execution time for instant route calculations.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="panel-card hover:shadow-xl transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-info p-8 md:p-12 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Optimize Your Routes?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join RuteKita today and start saving time and fuel with intelligent route planning.
              </p>
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-card text-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">RuteKita</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 RuteKita. WebGIS Route Optimization System.
          </p>
        </div>
      </footer>
    </div>
  );
}
